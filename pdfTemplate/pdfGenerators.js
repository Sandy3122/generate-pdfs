// const puppeteer = require('puppeteer');
// const { Cluster } = require('puppeteer-cluster');
// const ejs = require('ejs');
// const path = require('path');
// const fs = require('fs');
// const { PDFDocument, rgb } = require('pdf-lib');
// const ProgressBar = require('progress');
// const { exec } = require('child_process');

// const chromium = require('chrome-aws-lambda');


// // Path to the EJS template
// const templatePath = path.join(__dirname, '.', 'template', 'profileTemplate.ejs');

// // Function to compress PDF using Ghostscript without losing quality
// const compressPdf = (inputPath, outputPath, quality = 'printer') => {
//     return new Promise((resolve, reject) => {
//         const gsCommand = `
//             gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
//             -dPDFSETTINGS=/${quality} \
//             -dDownsampleColorImages=false \
//             -dAutoFilterColorImages=true \
//             -dJPEGQ=85 \
//             -dNOPAUSE -dQUIET -dBATCH \
//             -sOutputFile=${outputPath} ${inputPath}`;

//         exec(gsCommand, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`Error during PDF compression: ${error.message}`);
//                 return reject(error);
//             }
//             console.log(`PDF compression completed. Output file: ${outputPath}`);
//             resolve(outputPath);
//         });
//     });
// };




// const generatePdf = async (profiles) => {
//     try {
//         // Ensure profiles is always an array
//         const profilesArray = Array.isArray(profiles) ? profiles : [profiles];

//         console.log('PDF generation started...');
//         const startTime = new Date();
//         console.log(`Start Time: ${startTime.toLocaleString()}`);


//         const browser = await puppeteer.launch({
//             headless: true,
//             args: [
//                 "--no-sandbox",
//                 "--disable-gpu",
//             ],
//             executablePath: path.resolve(
//                 __dirname,
//                 '../.cache/puppeteer/chrome/linux-132.0.6834.110/chrome-linux64/chrome'
//               ),
//         });

//         const pdfDocuments = []; // Array to store generated PDF buffers

//         // Iterate over profiles and generate PDFs
//         for (const data of profilesArray) {
//             try {
//                 // Render the EJS template with dynamic data for each profile
//                 const html = await ejs.renderFile(templatePath, data);

//                 // Create a new page for each profile
//                 const page = await browser.newPage();
//                 await page.setContent(html, { waitUntil: ['domcontentloaded', 'networkidle0', 'load'] });

//                 // Generate the PDF for the current profile
//                 const pdfBuffer = await page.pdf({
//                     format: 'A3',
//                     printBackground: true,
//                     scale: 1,
//                     margin: 0,
//                 });

//                 pdfDocuments.push(await PDFDocument.load(pdfBuffer)); // Load the PDF buffer into pdf-lib
//                 await page.close(); // Close the page to free resources
//             } catch (err) {
//                 console.error(`Error processing profile: ${data.name || 'Unknown'}`, err);
//             }
//         }

//         await browser.close(); // Close the browser once all profiles are processed

//         // Merge all generated PDFs into a single document
//         const mergedPdf = await PDFDocument.create();
//         for (const pdfDoc of pdfDocuments) {
//             const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
//             copiedPages.forEach((page) => mergedPdf.addPage(page));
//         }

//         // Save the merged PDF to a file
//         const mergedPdfFile = await mergedPdf.save();
//         const outputPath = path.join(__dirname, 'output_profiles.pdf');
//         fs.writeFileSync(outputPath, mergedPdfFile);

//         // console.log('PDF merging completed successfully.');

//         const endTime = new Date();
//         console.log(`End Time: ${endTime.toLocaleString()}`);
//         const duration = (endTime - startTime) / 1000;
//         console.log(`PDFs generated in ${duration} seconds.`);

//         return outputPath;
//     } catch (error) {
//         console.error('Error generating PDFs:', error);
//         throw error;
//     }
// };




// Puppeteer with single page and multiple page
// const generatePdf = async (profiles) => {
//     try {
//         // Ensure profiles is always an array
//         const profilesArray = Array.isArray(profiles) ? profiles : [profiles];

//         console.log('PDF generation started...');
//         const startTime = new Date();
//         console.log(`Start Time: ${startTime.toLocaleString()}`);


//         const browser = await puppeteer.launch({
//             headless: true,
//             args: [
//                 "--no-sandbox",
//                 "--disable-gpu",
//             ]
//         });

//         const pdfDocuments = []; // Array to store generated PDF buffers

//         // Iterate over profiles and generate PDFs
//         for (const data of profilesArray) {
//             try {
//                 // Render the EJS template with dynamic data for each profile
//                 const html = await ejs.renderFile(templatePath, data);

//                 // Create a new page for each profile
//                 const page = await browser.newPage();
//                 await page.setContent(html, { waitUntil: ['domcontentloaded', 'networkidle0', 'load'] });

//                 // Generate the PDF for the current profile
//                 const pdfBuffer = await page.pdf({
//                     format: 'A3',
//                     printBackground: true,
//                     scale: 1,
//                     margin: 0,
//                 });

//                 pdfDocuments.push(await PDFDocument.load(pdfBuffer)); // Load the PDF buffer into pdf-lib
//                 await page.close(); // Close the page to free resources
//             } catch (err) {
//                 console.error(`Error processing profile: ${data.name || 'Unknown'}`, err);
//             }
//         }

//         await browser.close(); // Close the browser once all profiles are processed

//         // Merge all generated PDFs into a single document
//         const mergedPdf = await PDFDocument.create();
//         for (const pdfDoc of pdfDocuments) {
//             const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
//             copiedPages.forEach((page) => mergedPdf.addPage(page));
//         }

//         // Save the merged PDF to a file
//         const mergedPdfFile = await mergedPdf.save();
//         const outputPath = path.join(__dirname, 'output_profiles.pdf');
//         fs.writeFileSync(outputPath, mergedPdfFile);

//         console.log('PDF merging completed successfully.');

//         const endTime = new Date();
//         console.log(`End Time: ${endTime.toLocaleString()}`);
//         const duration = (endTime - startTime) / 1000;
//         console.log(`PDFs generated in ${duration} seconds.`);

//         return outputPath;
//     } catch (error) {
//         console.error('Error generating PDFs:', error);
//         throw error;
//     }
// };

// // // Function to generate single PDF with Puppeteer Cluster
// // const generatePdf = async (profiles) => {
// //     try {
// //         // Ensure profiles is always an array
// //         const profilesArray = Array.isArray(profiles) ? profiles : [profiles];

// //         console.log('PDF generation started...');
// //         const startTime = new Date();
// //         console.log(`Start Time: ${startTime.toLocaleString()}`);

// //         // // Launch Puppeteer browser with optimized settings
// //         // const browser = await puppeteer.launch({
// //         //     headless: true,
// //         //     executablePath: '/home/sandeep/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome' || puppeteer.executablePath(),  // Add the path here
// //         //     args: [
// //         //         '--no-sandbox',
// //         //         '--disable-setuid-sandbox',
// //         //         // '--disable-dev-shm-usage',
// //         //         // '--disable-accelerated-2d-canvas',
// //         //         // '--disable-gpu',
// //         //         // '--no-first-run',
// //         //         // '--single-process',
// //         //         // '--disable-extensions',
// //         //     ],
// //         // });

// //         const browser = await chromium.puppeteer.launch({
// //             args: chromium.args,
// //             defaultViewport: chromium.defaultViewport,
// //             executablePath: await chromium.executablePath,
// //             headless: chromium.headless,
// //         });

// //         const pdfDocuments = []; // Array to store generated PDF buffers

// //         // Iterate over profiles and generate PDFs
// //         for (const data of profilesArray) {
// //             try {
// //                 // Render the EJS template with dynamic data for each profile
// //                 const html = await ejs.renderFile(templatePath, data);

// //                 // Create a new page for each profile
// //                 const page = await browser.newPage();
// //                 await page.setContent(html, { waitUntil: ['domcontentloaded', 'networkidle0', 'load'] });

// //                 // Generate the PDF for the current profile
// //                 const pdfBuffer = await page.pdf({
// //                     format: 'A3',
// //                     printBackground: true,
// //                     scale: 1,
// //                     margin: 0,
// //                 });

// //                 pdfDocuments.push(await PDFDocument.load(pdfBuffer)); // Load the PDF buffer into pdf-lib
// //                 await page.close(); // Close the page to free resources
// //             } catch (err) {
// //                 console.error(`Error processing profile: ${data.name || 'Unknown'}`, err);
// //             }
// //         }

// //         await browser.close(); // Close the browser once all profiles are processed

// //         // Merge all generated PDFs into a single document
// //         const mergedPdf = await PDFDocument.create();
// //         for (const pdfDoc of pdfDocuments) {
// //             const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
// //             copiedPages.forEach((page) => mergedPdf.addPage(page));
// //         }

// //         // Save the merged PDF to a file
// //         const mergedPdfFile = await mergedPdf.save();
// //         const outputPath = path.join(__dirname, 'output_profiles.pdf');
// //         fs.writeFileSync(outputPath, mergedPdfFile);

// //         console.log('PDF merging completed successfully.');

// //         const endTime = new Date();
// //         console.log(`End Time: ${endTime.toLocaleString()}`);
// //         const duration = (endTime - startTime) / 1000;
// //         console.log(`PDFs generated in ${duration} seconds.`);

// //         return outputPath;
// //     } catch (error) {
// //         console.error('Error generating PDFs:', error);
// //         throw error;
// //     }
// // };


// // Function to generate PDFs in batches with Puppeteer Cluster



// const generateMultiPagePdf = async (profiles, batchSize = 5, maxConcurrency = 2) => {
//     try {
//         console.log('PDF generation started...');
//         const startTime = new Date();
//         console.log(`Start Time: ${startTime.toLocaleString()}`);

//         // Optimize cluster options
//         const options = {
//             concurrency: Cluster.CONCURRENCY_PAGE,
//             maxConcurrency,
//             puppeteerOptions: {
//                 headless: true,
//                 args: [
//                     '--no-sandbox',
//                     '--disable-setuid-sandbox',
//                     '--disable-dev-shm-usage',
//                     '--disable-gpu',
//                     '--no-first-run',
//                     '--single-process',
//                     '--disable-extensions',
//                     '--disable-javascript', // Disable JavaScript if not needed
//                     '--disable-images', // Disable images if not critical
//                 ],
//                 defaultViewport: {
//                     width: 1200,
//                     height: 1697, // A3 dimensions
//                     deviceScaleFactor: 1,
//                 },
//             },
//             monitor: false,
//             timeout: 30000, // Reduce timeout to 30 seconds per task
//             retryLimit: 2,
//         };

//         if (process.env.NODE_ENV === 'production') {
//             const chromium = require('chrome-aws-lambda');
//             options.puppeteerOptions.executablePath = await chromium.executablePath;
//         }

//         const cluster = await Cluster.launch(options);
//         const pdfDocuments = [];

//         // Optimize page rendering
//         await cluster.task(async ({ page, data }) => {
//             try {
//                 const { profile, bar } = data;

//                 // Set performance optimizations
//                 await page.setRequestInterception(true);
//                 page.on('request', (request) => {
//                     if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
//                         request.continue();
//                     } else {
//                         request.abort();
//                     }
//                 });

//                 // Render template with optimized settings
//                 const html = await ejs.renderFile(templatePath, profile);
//                 await page.setContent(html, { 
//                     waitUntil: ['domcontentloaded'],
//                     timeout: 20000 
//                 });

//                 // Generate PDF with optimized settings
//                 const pdfBuffer = await page.pdf({ 
//                     format: 'A3',
//                     printBackground: true,
//                     scale: 1,
//                     margin: 0,
//                     preferCSSPageSize: true,
//                 });

//                 const pdfDoc = await PDFDocument.load(pdfBuffer);
//                 pdfDocuments.push(pdfDoc);
//                 bar.tick();
//             } catch (err) {
//                 console.error(`Error processing profile: ${data.profile.name || 'Unknown'}`, err);
//             }
//         });

//         // Process profiles in smaller batches
//         const bar = new ProgressBar(':bar :current/:total profiles', {
//             total: profiles.length,
//             width: 40,
//         });

//         // Process in smaller chunks
//         for (let i = 0; i < profiles.length; i += batchSize) {
//             const batch = profiles.slice(i, i + batchSize);
//             await Promise.all(batch.map(profile => cluster.queue({ profile, bar })));
//         }

//         await cluster.idle();
//         await cluster.close();

//         // Merge PDFs more efficiently
//         const mergedPdf = await PDFDocument.create();
//         for (const pdfDoc of pdfDocuments) {
//             const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
//             copiedPages.forEach(page => mergedPdf.addPage(page));
//         }

//         const mergedPdfFile = await mergedPdf.save();
//         const mergedPdfPath = path.join(__dirname, 'output_profiles.pdf');
//         fs.writeFileSync(mergedPdfPath, mergedPdfFile);

//         // Skip compression for faster processing
//         const outputPath = mergedPdfPath;

//         const endTime = new Date();
//         console.log(`End Time: ${endTime.toLocaleString()}`);
//         const duration = (endTime - startTime) / 1000;
//         console.log(`PDF generation completed in ${duration} seconds.`);

//         return outputPath;
//     } catch (error) {
//         console.error('Error during PDF generation:', error);
//         throw error;
//     }
// };


















// const puppeteer = require('puppeteer');
// const { PDFDocument } = require('pdf-lib');
// const path = require('path');
// const fs = require('fs');
// const ejs = require('ejs');
// const { exec } = require('child_process');

// // Path to the EJS template
// const templatePath = path.join(__dirname, '.', 'template', 'profileTemplate.ejs');

// // Function to compress PDF using Ghostscript without losing quality
// const compressPdf = (inputPath, outputPath, quality = 'printer') => {
//     return new Promise((resolve, reject) => {
//         const gsCommand = `
//             gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
//             -dPDFSETTINGS=/${quality} \
//             -dDownsampleColorImages=false \
//             -dAutoFilterColorImages=true \
//             -dJPEGQ=85 \
//             -dNOPAUSE -dQUIET -dBATCH \
//             -sOutputFile=${outputPath} ${inputPath}`;

//         exec(gsCommand, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`Error during PDF compression: ${error.message}`);
//                 return reject(error);
//             }
//             console.log(`PDF compression completed. Output file: ${outputPath}`);
//             resolve(outputPath);
//         });
//     });
// };

// // PDF generation logic
// const generatePdf = async (profiles) => {
//     try {
//         // Ensure profiles is always an array
//         const profilesArray = Array.isArray(profiles) ? profiles : [profiles];

//         // console.log('PDF generation started...');
//         const startTime = new Date();
//         console.log(`Start Time: ${startTime.toLocaleString()}`);

//         // Launch Puppeteer browser
//         const browser = await puppeteer.launch({
//             headless: true,
//             args: ['--no-sandbox', '--disable-gpu'],
//             executablePath: puppeteer.executablePath(),
//         });

//         const pdfDocuments = []; // Array to store generated PDF buffers

//         for (const data of profilesArray) {
//             try {
//                 // Render the EJS template with dynamic data for each profile
//                 const html = await ejs.renderFile(templatePath, data);

//                 // Create a new page for each profile
//                 const page = await browser.newPage();
//                 await page.setContent(html, { waitUntil: ['domcontentloaded', 'networkidle0', 'load'] });

//                 // Generate the PDF for the current profile
//                 const pdfBuffer = await page.pdf({
//                     format: 'A3',
//                     // width: '290mm',
//                     // height: '407mm',
//                     printBackground: true,
//                     // scale: 1,
//                 });

//                 pdfDocuments.push(await PDFDocument.load(pdfBuffer)); // Load the PDF buffer into pdf-lib
//                 await page.close(); // Close the page to free resources
//             } catch (err) {
//                 console.error(`Error processing profile: ${data.name || 'Unknown'}`, err);
//             }
//         }

//         await browser.close(); // Close the browser once all profiles are processed

//         // Merge all generated PDFs into a single document
//         const mergedPdf = await PDFDocument.create();
//         for (const pdfDoc of pdfDocuments) {
//             const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
//             copiedPages.forEach((page) => mergedPdf.addPage(page));
//         }

//         // Save the merged PDF to a file
//         const mergedPdfFile = await mergedPdf.save();
//         const outputPath = path.join(__dirname, 'output_profiles.pdf');
//         fs.writeFileSync(outputPath, mergedPdfFile);

//         console.log('PDF merging completed successfully.');

//         const endTime = new Date();
//         console.log(`End Time: ${endTime.toLocaleString()}`);
//         const duration = (endTime - startTime) / 1000;
//         // console.log(`PDFs generated in ${duration} seconds.`);

//         return outputPath;
//     } catch (error) {
//         console.error('Error generating PDFs:', error);
//         throw error;
//     }
// };


// const generateMultiPagePdf = async (profiles, batchSize = 5) => {
//     try {
//         const startTime = new Date();
//         console.log(`Batch-wise PDF generation started at: ${startTime.toLocaleString()}`);

//         const pdfDocuments = []; // Array to store generated PDF buffers
//         const batches = Math.ceil(profiles.length / batchSize); // Number of batches

//         const processBatch = async (batchProfiles) => {
//             const batchDocuments = [];
//             for (const data of batchProfiles) {
//                 try {
//                     // Render the EJS template with dynamic data for each profile
//                     const html = await ejs.renderFile(templatePath, data);
//                     // console.log("html: ", html);  // Check if HTML is as expected

//                     if (!html || html.trim() === '') {
//                         console.log(`Empty HTML for profile: ${data.name || 'Unknown'}`);
//                         continue; // Skip this profile if HTML is empty
//                     }

//                     // Launch Puppeteer and create a new page for each profile
//                     const browser = await puppeteer.launch({
//                         headless: true,
//                         args: ['--no-sandbox', '--disable-gpu'],
//                         executablePath: puppeteer.executablePath(),
//                     });

//                     const page = await browser.newPage();
//                     await page.setContent(html, { waitUntil: ['domcontentloaded', 'load'] }); // Wait until content is loaded

//                     // Debugging: Check if content is correctly rendered
//                     const content = await page.evaluate(() => document.body.innerHTML);
//                     // console.log("Rendered HTML: ", content); // This will show the actual rendered HTML in the browser

//                     // Ensure that the HTML is correctly rendered
//                     if (!content.trim()) {
//                         console.log("Rendered content is empty, skipping PDF generation for this profile.");
//                         continue;
//                     }

//                     // Generate the PDF for the current profile
//                     const pdfBuffer = await page.pdf({
//                         format: 'A3',
//                         printBackground: true,
//                         scale: 1,
//                         pageRanges: '1', // Only generate the first page (to avoid empty pages)
//                     });

//                     batchDocuments.push(await PDFDocument.load(pdfBuffer)); // Load the PDF buffer into pdf-lib
//                     await page.close(); // Close the page to free resources
//                     await browser.close(); // Close the browser after generating the page
//                 } catch (err) {
//                     console.error(`Error processing profile: ${data.name || 'Unknown'}`, err);
//                 }
//             }
//             return batchDocuments;
//         };

//         // Process batches concurrently using Promise.all
//         const allBatchDocuments = [];
//         for (let i = 0; i < batches; i++) {
//             const batchProfiles = profiles.slice(i * batchSize, (i + 1) * batchSize);
//             const batchResult = processBatch(batchProfiles);
//             allBatchDocuments.push(batchResult);
//         }

//         // Wait for all batches to finish
//         const mergedPdf = await PDFDocument.create();
//         const batchResults = await Promise.all(allBatchDocuments);

//         // Merge all generated PDFs into a single document
//         for (const batchDocuments of batchResults) {
//             for (const pdfDoc of batchDocuments) {
//                 const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
//                 copiedPages.forEach((page) => mergedPdf.addPage(page));
//             }
//         }

//         // Save the merged PDF to a file
//         const mergedPdfFile = await mergedPdf.save();
//         const outputPath = path.join(__dirname, 'output_profiles_batch.pdf');
//         fs.writeFileSync(outputPath, mergedPdfFile);

//         const endTime = new Date();
//         console.log(`Batch-wise PDF generation completed at: ${endTime.toLocaleString()}`);
//         const duration = (endTime - startTime) / 1000;
//         // console.log(`PDFs generated in ${duration} seconds.`);

//         return outputPath;
//     } catch (error) {
//         console.error('Error generating batch-wise PDFs:', error);
//         throw error;
//     }
// };

// const generatePdfFunction = async (profiles) => {
//     try {
//         if (!profiles || profiles.length === 0) {
//             throw new Error('Profiles data is required');
//         }

//         let outputPath;
//         if(profiles.length === 1){
//             outputPath = await generatePdf(profiles[0]);
//         }
//         else{
//             outputPath = await generateMultiPagePdf(profiles);
//         }

        
//         // Compress the generated PDF (optional)
//         const compressedOutputPath = outputPath.replace('.pdf', '_compressed.pdf');
//         await compressPdf(outputPath, compressedOutputPath);

//         return {
//             success: true,
//             message: 'PDF generated successfully',
//             path: compressedOutputPath,
//         };
//     } catch (error) {
//         console.error('Error in generatePdfFunction:', error);
//         return {
//             success: false,
//             message: 'Internal Server Error. PDF generation failed.',
//             error: error.message,
//         };
//     }
// };




























// const express = require('express');
// const router = express.Router();
// const admin = require('firebase-admin');
// const db = admin.firestore();
// const ejs = require('ejs');
// const path = require('path');
// const fs = require('fs').promises; // Use fs.promises for async file operations
// const { PDFDocument, rgb } = require('pdf-lib');
// const { exec } = require('child_process');
// const htmlPdf = require('html-pdf-node');
// const wkhtmltopdf = require('wkhtmltopdf');
// const os = require('os');



// // Path to the EJS template
// const templatePath = path.join(__dirname, '.', 'template', 'profileTemplate.ejs');

// // Function to compress PDF using Ghostscript without losing quality
// const compressPdf = (inputPath, outputPath, quality = 'printer') => {
//     return new Promise((resolve, reject) => {
//         const gsCommand = `
//             gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
//             -dPDFSETTINGS=/${quality} \
//             -dDownsampleColorImages=false \
//             -dAutoFilterColorImages=true \
//             -dJPEGQ=85 \
//             -dNOPAUSE -dQUIET -dBATCH \
//             -sOutputFile=${outputPath} ${inputPath}`;

//         exec(gsCommand, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`Error during PDF compression: ${error.message}`);
//                 return reject(error);
//             }
//             console.log(`PDF compression completed. Output file: ${outputPath}`);
//             resolve(outputPath);
//         });
//     });
// };

// // // Function to generate PDFs
// const generatePdf = async (profile) => {
//     try {
//         console.log('PDF generation started...');
//         const startTime = new Date();
//         console.log(`Start Time: ${startTime.toLocaleString()}`);

//         // Render HTML from EJS template
//         const html = await ejs.renderFile(templatePath, profile);

//         // Generate PDF buffer from HTML
//         const pdfBuffer = await htmlPdf.generatePdf({ content: html }, { 
//             // format: 'A3',
//             width: '297mm',
//             height: '407mm',
//             printBackground: true });

//         const pdfDoc = await PDFDocument.load(pdfBuffer);
//         const mergedPdf = await PDFDocument.create();

//         const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
//         copiedPages.forEach((page) => mergedPdf.addPage(page));

//         // Save merged PDF
//         const mergedPdfFile = await mergedPdf.save();
//         const mergedPdfPath = path.join(__dirname, 'output_profiles.pdf');
//         await fs.writeFile(mergedPdfPath, mergedPdfFile);

//         console.log('Merging PDFs completed. Starting compression...');
//         const compressedPdfPath = path.join(__dirname, 'output_profiles_compressed.pdf');
//         await compressPdf(mergedPdfPath, compressedPdfPath, 'screen');

//         const endTime = new Date();
//         console.log(`End Time: ${endTime.toLocaleString()}`);
//         const duration = (endTime - startTime) / 1000;
//         console.log(`PDF generation and compression completed in ${duration} seconds.`);

//         // Clean up merged PDF file after compression
//         await fs.unlink(mergedPdfPath); // Delete merged PDF after compression

//         return compressedPdfPath;
//     } catch (error) {
//         console.error('Error generating PDFs:', error);
//         throw error;
//     }
// };



// const generateMultiPagePdf = async (profiles) => {
//     try {
//         console.log('PDF generation started...');
//         const startTime = new Date();
//         console.log(`Start Time: ${startTime.toLocaleString()}`);

//         const BATCH_SIZE = 10; // Number of profiles in each batch
//         const CONCURRENCY_LIMIT = 5; // Number of concurrent PDF generations

//         const profileBatches = [];
//         // Split profiles into batches of BATCH_SIZE
//         for (let i = 0; i < profiles.length; i += BATCH_SIZE) {
//             profileBatches.push(profiles.slice(i, i + BATCH_SIZE));
//         }

//         const processBatch = async (batch) => {
//             // Break batch into smaller groups for concurrency control
//             const profileChunks = [];
//             for (let i = 0; i < batch.length; i += CONCURRENCY_LIMIT) {
//                 profileChunks.push(batch.slice(i, i + CONCURRENCY_LIMIT));
//             }

//             // Process profiles with concurrency limit
//             const pdfBuffers = [];
//             for (const chunk of profileChunks) {
//                 const chunkBuffers = await Promise.all(
//                     chunk.map(async (profile) => {
//                         const html = await ejs.renderFile(templatePath, profile);
//                         const pdfBuffer = await htmlPdf.generatePdf(
//                             { content: html },
//                             {
//                                 width: '297mm',
//                                 height: '407mm',
//                                 printBackground: true,
//                                 displayHeaderFooter: false,
//                             }
//                         );
//                         return pdfBuffer.buffer;
//                     })
//                 );
//                 pdfBuffers.push(...chunkBuffers);
//             }

//             return pdfBuffers;
//         };

//         const mergedPdf = await PDFDocument.create();

//         // Process each batch sequentially
//         for (const batch of profileBatches) {
//             console.log(`Processing batch of size: ${batch.length}`);
//             const batchBuffers = await processBatch(batch);

//             // Merge batch PDFs
//             for (const pdfBuffer of batchBuffers) {
//                 const pdfDoc = await PDFDocument.load(pdfBuffer);
//                 const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
//                 copiedPages.forEach((page) => mergedPdf.addPage(page));
//             }
//         }

//         // Save the merged PDF
//         const mergedPdfFile = await mergedPdf.save();
//         const mergedPdfPath = path.join(__dirname, 'all_profiles.pdf');
//         await fs.writeFile(mergedPdfPath, mergedPdfFile);

//         console.log('Merging PDFs completed. Starting compression...');
//         const compressedPdfPath = path.join(__dirname, 'all_profiles_compressed.pdf');
//         await compressPdf(mergedPdfPath, compressedPdfPath, 'screen');

//         const endTime = new Date();
//         console.log(`End Time: ${endTime.toLocaleString()}`);
//         const duration = (endTime - startTime) / 1000;
//         console.log(`PDF generation and compression completed in ${duration} seconds.`);

//         // Clean up merged PDF file after compression
//         await fs.unlink(mergedPdfPath); // Delete merged PDF after compression

//         return compressedPdfPath;
//     } catch (error) {
//         console.error('Error generating PDFs:', error);
//         throw error;
//     }
// };


























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
            executablePath: puppeteer.executablePath(),
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
                        executablePath:puppeteer.executablePath(),
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