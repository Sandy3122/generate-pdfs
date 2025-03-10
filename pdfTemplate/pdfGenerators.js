const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const { exec } = require('child_process');

// Path to the EJS template
const templatePath = path.join(__dirname, '.', 'template', 'profileTemplate.ejs');

// Function to compress PDF using Ghostscript without losing quality
const compressPdf = (inputPath, outputPath, quality = 'printer') => {
    return new Promise((resolve, reject) => {
        const gsCommand = `
            gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
            -dPDFSETTINGS=/${quality} \
            -dDownsampleColorImages=false \
            -dAutoFilterColorImages=true \
            -dJPEGQ=85 \
            -dNOPAUSE -dQUIET -dBATCH \
            -sOutputFile=${outputPath} ${inputPath}`;

        exec(gsCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error during PDF compression: ${error.message}`);
                return reject(error);
            }
            console.log(`PDF compression completed. Output file: ${outputPath}`);
            resolve(outputPath);
        });
    });
};

// PDF generation logic
const generatePdf = async (profiles) => {
    try {
        // Ensure profiles is always an array
        const profilesArray = Array.isArray(profiles) ? profiles : [profiles];

        // console.log('PDF generation started...');
        const startTime = new Date();
        console.log(`Start Time: ${startTime.toLocaleString()}`);

        // Launch Puppeteer browser
        const browser = await puppeteer.launch({
            // executablePath: puppeteer.executablePath(),
            headless: true,
            args: ['--no-sandbox', '--disable-gpu'],
            
        });

        const pdfDocuments = []; // Array to store generated PDF buffers

        for (const data of profilesArray) {
            try {
                // Render the EJS template with dynamic data for each profile
                const html = await ejs.renderFile(templatePath, data);

                // Create a new page for each profile
                const page = await browser.newPage();
                await page.setContent(html, { waitUntil: ['domcontentloaded', 'networkidle0', 'load'] });

                // Generate the PDF for the current profile
                const pdfBuffer = await page.pdf({
                    format: 'A3',
                    // width: '290mm',
                    // height: '407mm',
                    printBackground: true,
                    // scale: 1,
                });

                pdfDocuments.push(await PDFDocument.load(pdfBuffer)); // Load the PDF buffer into pdf-lib
                await page.close(); // Close the page to free resources
            } catch (err) {
                console.error(`Error processing profile: ${data.name || 'Unknown'}, err`);
            }
        }

        await browser.close(); // Close the browser once all profiles are processed

        // Merge all generated PDFs into a single document
        const mergedPdf = await PDFDocument.create();
        for (const pdfDoc of pdfDocuments) {
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        // Save the merged PDF to a file
        const mergedPdfFile = await mergedPdf.save();
        const outputPath = path.join(__dirname, 'output_profiles.pdf');
        fs.writeFileSync(outputPath, mergedPdfFile);

        console.log('PDF merging completed successfully.');

        const endTime = new Date();
        console.log(`End Time: ${endTime.toLocaleString()}`);
        const duration = (endTime - startTime) / 1000;
        // console.log(PDFs generated in ${duration} seconds.);

        return outputPath;
    } catch (error) {
        console.error('Error generating PDFs:', error);
        throw error;
    }
};


const generateMultiPagePdf = async (profiles, batchSize = 5) => {
    try {
        const startTime = new Date();
        console.log(`Batch-wise PDF generation started at: ${startTime.toLocaleString()}`);

        const pdfDocuments = []; // Array to store generated PDF buffers
        const batches = Math.ceil(profiles.length / batchSize); // Number of batches

        const processBatch = async (batchProfiles) => {
            const batchDocuments = [];
            for (const data of batchProfiles) {
                try {
                    // Render the EJS template with dynamic data for each profile
                    const html = await ejs.renderFile(templatePath, data);
                    // console.log("html: ", html);  // Check if HTML is as expected

                    if (!html || html.trim() === '') {
                        console.log(`Empty HTML for profile: ${data.name || 'Unknown'}`);
                        continue; // Skip this profile if HTML is empty
                    }

                    // Launch Puppeteer and create a new page for each profile
                    const browser = await puppeteer.launch({
                        headless: true,
                        args: ['--no-sandbox', '--disable-gpu'],
                        // executablePath:puppeteer.executablePath(),
                    });

                    const page = await browser.newPage();
                    await page.setContent(html, { waitUntil: ['domcontentloaded', 'load'] }); // Wait until content is loaded

                    // Debugging: Check if content is correctly rendered
                    const content = await page.evaluate(() => document.body.innerHTML);
                    // console.log("Rendered HTML: ", content); // This will show the actual rendered HTML in the browser

                    // Ensure that the HTML is correctly rendered
                    if (!content.trim()) {
                        console.log("Rendered content is empty, skipping PDF generation for this profile.");
                        continue;
                    }

                    // Generate the PDF for the current profile
                    const pdfBuffer = await page.pdf({
                        format: 'A3',
                        printBackground: true,
                        scale: 1,
                        pageRanges: '1', // Only generate the first page (to avoid empty pages)
                    });

                    batchDocuments.push(await PDFDocument.load(pdfBuffer)); // Load the PDF buffer into pdf-lib
                    await page.close(); // Close the page to free resources
                    await browser.close(); // Close the browser after generating the page
                } catch (err) {
                    console.error(`Error processing profile: ${data.name || 'Unknown'}, err`);
                }
            }
            return batchDocuments;
        };

        // Process batches concurrently using Promise.all
        const allBatchDocuments = [];
        for (let i = 0; i < batches; i++) {
            const batchProfiles = profiles.slice(i * batchSize, (i + 1) * batchSize);
            const batchResult = processBatch(batchProfiles);
            allBatchDocuments.push(batchResult);
        }

        // Wait for all batches to finish
        const mergedPdf = await PDFDocument.create();
        const batchResults = await Promise.all(allBatchDocuments);

        // Merge all generated PDFs into a single document
        for (const batchDocuments of batchResults) {
            for (const pdfDoc of batchDocuments) {
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
        }

        // Save the merged PDF to a file
        const mergedPdfFile = await mergedPdf.save();
        const outputPath = path.join(__dirname, 'output_profiles_batch.pdf');
        fs.writeFileSync(outputPath, mergedPdfFile);

        const endTime = new Date();
        console.log(`Batch-wise PDF generation completed at: ${endTime.toLocaleString()}`);
        const duration = (endTime - startTime) / 1000;
        // console.log(PDFs generated in ${duration} seconds.);

        return outputPath;
    } catch (error) {
        console.error('Error generating batch-wise PDFs:', error);
        throw error;
    }
};

const generatePdfFunction = async (profiles) => {
    try {
        if (!profiles || profiles.length === 0) {
            throw new Error('Profiles data is required');
        }

        let outputPath;
        if(profiles.length === 1){
            outputPath = await generatePdf(profiles[0]);
        }
        else{
            outputPath = await generateMultiPagePdf(profiles);
        }

        
        // Compress the generated PDF (optional)
        const compressedOutputPath = outputPath.replace('.pdf', '_compressed.pdf');
        await compressPdf(outputPath, compressedOutputPath);

        return {
            success: true,
            message: 'PDF generated successfully',
            path: compressedOutputPath,
        };
    } catch (error) {
        console.error('Error in generatePdfFunction:', error);
        return {
            success: false,
            message: 'Internal Server Error. PDF generation failed.',
            error: error.message,
        };
    }
};


module.exports = {
    generatePdf,
    // generateMultiPagePdf,
    generatePdfFunction
};