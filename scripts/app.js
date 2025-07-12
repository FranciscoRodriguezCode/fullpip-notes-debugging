const noteArea = document.getElementById('note-area');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');
let filename = '';

// Show filename modal on load
window.addEventListener('load', () => {
    const modal = document.getElementById('filename-modal');
    const filenameInput = document.getElementById('filename-input');
    const continueBtn = document.getElementById('filename-continue');
      
    modal.style.display = 'flex';
    filenameInput.focus();

    // Update the handleFilenameSubmit function
    function handleFilenameSubmit() {
        filename = filenameInput.value.trim() || 'Untitled Document';
        modal.style.display = 'none';
        
        // Add title with three line breaks for better spacing
        noteArea.innerHTML = `${filename}<br><br><br>`;
        
        // Set cursor to start of third line
        const range = document.createRange();
        const selection = window.getSelection();
        
        // Create a text node to ensure cursor placement
        const textNode = document.createTextNode('');
        noteArea.appendChild(textNode);
        
        range.setStart(textNode, 0);
        range.collapse(true);
        
        selection.removeAllRanges();
        selection.addRange(range);
        
        noteArea.focus();
    }

    continueBtn.addEventListener('click', handleFilenameSubmit);
    filenameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleFilenameSubmit();
        }
    });
});

// Prevent scroll on focus
noteArea.addEventListener('focus', (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
});

// Auto-scroll textarea
noteArea.addEventListener('input', () => {
    noteArea.scrollTop = noteArea.scrollHeight;
});

// Simple Enter key behavior
noteArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.execCommand('insertLineBreak');
    }
});

// Download functionality
downloadBtn.addEventListener('click', () => {
    const plainText = noteArea.innerText;
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename || 'notes'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Clipboard functionality
copyBtn.addEventListener('click', async () => {
    const plainText = noteArea.innerText;
    try {
        await navigator.clipboard.writeText(plainText);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (err) {
        fallbackCopyToClipboard(plainText);
    }
});

// Simplified fallback copy function
function fallbackCopyToClipboard(text) {
    const tempElement = document.createElement('textarea');
    tempElement.value = text;
    document.body.appendChild(tempElement);
    tempElement.select();
    
    try {
        document.execCommand('copy');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (err) {
        console.error('Fallback clipboard copy failed:', err);
        alert('Copy failed. Please try selecting and copying manually.');
    }

    document.body.removeChild(tempElement);
}

// Keep theme handling as is...