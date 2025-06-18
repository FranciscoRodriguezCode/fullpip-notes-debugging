const noteArea = document.getElementById('note-area');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');
const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const underlineBtn = document.getElementById('underline-btn');
let filename = '';

// Format buttons functionality
function formatText(command) {
    document.execCommand(command, false, null);
    noteArea.focus();
}

boldBtn.addEventListener('click', () => {
    formatText('bold');
    boldBtn.classList.toggle('active');
});

italicBtn.addEventListener('click', () => {
    formatText('italic');
    italicBtn.classList.toggle('active');
});

underlineBtn.addEventListener('click', () => {
    formatText('underline');
    underlineBtn.classList.toggle('active');
});

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
        
        // Add title with proper spacing
        noteArea.innerHTML = `${filename}<br><br>`;
        
        // Set cursor to start of new line
        const range = document.createRange();
        const selection = window.getSelection();
        const lastNode = noteArea.lastChild;
        
        range.setStartAfter(lastNode);
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
  const preventScroll = () => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  preventScroll();
  setTimeout(preventScroll, 50);
});

// Auto-scroll textarea
noteArea.addEventListener('input', () => {
  noteArea.scrollTop = noteArea.scrollHeight;
});

// Handle bullet points
noteArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const currentLine = range.commonAncestorContainer;
        
        // Only check for bullets if line starts with '-'
        if (currentLine.textContent.startsWith('- ')) {
            e.preventDefault();
            
            // Check if bullet point is empty
            if (currentLine.textContent.trim() === '-' || currentLine.textContent.trim() === '- ') {
                // Remove empty bullet and add line break
                currentLine.textContent = '';
                document.execCommand('insertLineBreak');
            } else {
                // Add new bullet point after non-empty bullet line
                document.execCommand('insertLineBreak');
                document.execCommand('insertText', false, '- ');
            }
        } else {
            // Normal line break for non-bullet lines
            document.execCommand('insertLineBreak');
        }
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
    const formattedContent = noteArea.innerHTML;
    
    try {
        await navigator.clipboard.writeText(formattedContent);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (err) {
        // Fallback for formatting support
        const clipboardItem = new ClipboardItem({
            'text/html': new Blob([formattedContent], { type: 'text/html' }),
            'text/plain': new Blob([noteArea.innerText], { type: 'text/plain' })
        });
        
        try {
            await navigator.clipboard.write([clipboardItem]);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            fallbackCopyToClipboard(noteArea.innerText);
        }
    }
});

// Update fallback function
function fallbackCopyToClipboard(text) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = text;
    tempElement.style.position = 'fixed';
    tempElement.style.top = '0';
    tempElement.style.left = '-9999px';
    document.body.appendChild(tempElement);
    
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(tempElement);
    selection.removeAllRanges();
    selection.addRange(range);

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

// Theme handling
const themeBtn = document.getElementById('theme-btn');
const colorModal = document.getElementById('color-modal');
const colorOptions = document.querySelectorAll('.color-option');

const themes = {
  light: {
    '--text-color': '#000',
    '--background-color': '#f5f5f5',
    '--button-bg': '#ffffff',
    '--button-border': '#d1d1d1',
    '--textarea-bg': '#ffffff',
    '--textarea-border': '#d1d1d1',
    '--border-color': '#d1d1d1'  // Add border color for pip container
  },
  dark: {
    '--text-color': '#fff',
    '--background-color': '#222',
    '--button-bg': '#333',
    '--button-border': '#fff',
    '--textarea-bg': '#333',
    '--textarea-border': '#555',
    '--border-color': '#fff'
  }
};

themeBtn.addEventListener('click', () => {
  colorModal.style.display = 'flex';
});

colorOptions.forEach(option => {
  option.addEventListener('click', () => {
    const theme = option.getAttribute('data-theme');
    applyTheme(theme);
    colorModal.style.display = 'none';
        
    // Save theme preference
    localStorage.setItem('preferred-theme', theme);
  });
});

function applyTheme(theme) {
  const themeVars = themes[theme];
  for (const [property, value] of Object.entries(themeVars)) {
    document.documentElement.style.setProperty(property, value);
  }
  updateThemeColors(theme === 'dark');
}
// Update theme colors for meta tags
function updateThemeColors(isDark) {
    const themeColor = isDark ? '#333333' : '#ffffff';
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = themeColor;
    }

    // Update status bar style for iOS
    const statusBarStyle = isDark ? 'black-translucent' : 'default';
    const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (statusBarMeta) {
        statusBarMeta.content = statusBarStyle;
    }
}

// Load saved theme preference or set default theme
const savedTheme = localStorage.getItem('preferred-theme') || 'light';
applyTheme(savedTheme);

// Handle viewport changes
if (window.visualViewport) {
    let maxVisualHeight = window.innerHeight;
      
    function handleViewportChange() {
        const visualHeight = window.visualViewport.height;
        document.documentElement.style.height = `${visualHeight}px`;
        document.body.style.height = `${visualHeight}px`;
        
        const buttonContainer = document.querySelector('.button-container');
        const textBoxContainer = document.querySelector('.text-box-container');

        if (visualHeight < maxVisualHeight * 0.7) {
            buttonContainer.style.display = 'none';
            textBoxContainer.style.marginBottom = '0';
            
            const pipHeight = document.querySelector('.pip-container').offsetHeight;
            const topSpacerHeight = document.querySelector('.fullpip-top-spacer').offsetHeight;
            const keyboardPadding = 20;
            const availableHeight = visualHeight - (pipHeight + topSpacerHeight + keyboardPadding);
            
            textBoxContainer.style.position = 'fixed';
            textBoxContainer.style.top = `${pipHeight + topSpacerHeight}px`;
            textBoxContainer.style.height = `${availableHeight}px`;
            textBoxContainer.style.left = '0';
            textBoxContainer.style.right = '0';
        } else {
            buttonContainer.style.display = 'flex';
            textBoxContainer.style.position = '';
            textBoxContainer.style.top = '';
            textBoxContainer.style.height = '';
            textBoxContainer.style.left = '';
            textBoxContainer.style.right = '';
            textBoxContainer.style.marginBottom = 'var(--pip-full-padding)';
        }
    }

    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', handleViewportChange);
    
    window.addEventListener('load', () => {
        maxVisualHeight = window.innerHeight;
        setTimeout(handleViewportChange, 100);
    });
}