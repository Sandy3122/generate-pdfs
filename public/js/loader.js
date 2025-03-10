// // Define the showLoader function
// function showLoader() {
//     // Create overlay element with a specific class
//     const overlay = document.createElement('div');
//     overlay.classList.add('loader-overlay'); // Add class for easy identification
//     overlay.style.position = 'fixed';
//     overlay.style.top = '0';
//     overlay.style.left = '0';
//     overlay.style.width = '100%';
//     overlay.style.height = '100%';
//     overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // White background with some opacity
//     overlay.style.zIndex = '1000'; // Ensure it's above other content
//     document.body.appendChild(overlay);

//     // Create spinner element with a specific class
//     const spinner = document.createElement('div');
//     spinner.classList.add('lds-ripple'); // Add class for easy identification
//     spinner.style.position = 'fixed';
//     spinner.style.top = '50%';
//     spinner.style.left = '50%';
//     spinner.style.transform = 'translate(-50%, -50%)';
//     spinner.style.zIndex = '1001'; // Ensure it's above the overlay
//     spinner.style.width = '80px';
//     spinner.style.height = '80px';

//     const div1 = document.createElement('div');
//     const div2 = document.createElement('div');
//     spinner.appendChild(div1);
//     spinner.appendChild(div2);

//     const style = document.createElement('style');
//     style.textContent = `
//         .lds-ripple {
//             color: #ff2f68;
//             display: inline-block;
//             width: 80px;
//             height: 80px;
//         }
//         .lds-ripple div {
//             position: absolute;
//             border: 4px solid currentColor;
//             opacity: 1;
//             border-radius: 50%;
//             animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
//         }
//         .lds-ripple div:nth-child(2) {
//             animation-delay: -0.5s;
//         }
//         @keyframes lds-ripple {
//             0% {
//                 top: 36px;
//                 left: 36px;
//                 width: 8px;
//                 height: 8px;
//                 opacity: 0;
//             }
//             4.9% {
//                 top: 36px;
//                 left: 36px;
//                 width: 8px;
//                 height: 8px;
//                 opacity: 0;
//             }
//             5% {
//                 top: 36px;
//                 left: 36px;
//                 width: 8px;
//                 height: 8px;
//                 opacity: 1;
//             }
//             100% {
//                 top: 0;
//                 left: 0;
//                 width: 80px;
//                 height: 80px;
//                 opacity: 0;
//             }
//         }
//     `;

//     document.head.appendChild(style);
//     document.body.appendChild(spinner);
// }

// // Define the hideLoader function
// function hideLoader() {
//     const overlay = document.querySelector('.loader-overlay'); // Correct class name
//     const spinner = document.querySelector('.lds-ripple'); // Correct class name
//     if (overlay && spinner) {
//         overlay.remove();
//         spinner.remove();
//     }
// }

// Define the showLoader function
function showLoader() {
    // Create overlay element with a specific class
    const overlay = document.createElement('div');
    overlay.classList.add('loader-overlay'); // Add class for easy identification
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // White background with some opacity
    overlay.style.zIndex = '1000'; // Ensure it's above other content
    overlay.style.pointerEvents = 'auto'; // Enable pointer events on the overlay
    document.body.appendChild(overlay);

    // Disable pointer events on the entire document body except the overlay
    document.body.style.pointerEvents = 'none';

    // Create spinner element with a specific class
    const spinner = document.createElement('div');
    spinner.classList.add('lds-ripple'); // Add class for easy identification
    spinner.style.position = 'fixed';
    spinner.style.top = '50%';
    spinner.style.left = '50%';
    spinner.style.transform = 'translate(-50%, -50%)';
    spinner.style.zIndex = '1001'; // Ensure it's above the overlay
    spinner.style.width = '80px';
    spinner.style.height = '80px';

    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    spinner.appendChild(div1);
    spinner.appendChild(div2);

    const style = document.createElement('style');
    style.textContent = `
        .lds-ripple {
            color: #ff2f68;
            display: inline-block;
            width: 80px;
            height: 80px;
        }
        .lds-ripple div {
            position: absolute;
            border: 4px solid currentColor;
            opacity: 1;
            border-radius: 50%;
            animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        .lds-ripple div:nth-child(2) {
            animation-delay: -0.5s;
        }
        @keyframes lds-ripple {
            0% {
                top: 36px;
                left: 36px;
                width: 8px;
                height: 8px;
                opacity: 0;
            }
            4.9% {
                top: 36px;
                left: 36px;
                width: 8px;
                height: 8px;
                opacity: 0;
            }
            5% {
                top: 36px;
                left: 36px;
                width: 8px;
                height: 8px;
                opacity: 1;
            }
            100% {
                top: 0;
                left: 0;
                width: 80px;
                height: 80px;
                opacity: 0;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(spinner);
}

// Define the hideLoader function
function hideLoader() {
    const overlay = document.querySelector('.loader-overlay'); // Correct class name
    const spinner = document.querySelector('.lds-ripple'); // Correct class name
    if (overlay && spinner) {
        overlay.remove();
        spinner.remove();
    }
    // Re-enable pointer events on the entire document body
    document.body.style.pointerEvents = 'auto';
}
