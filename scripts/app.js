const textBox = document.getElementById('note-area');
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

  function handleFilenameSubmit() {
    filename = filenameInput.value.trim() || 'Untitled Document';
    modal.style.display = 'none';
    textBox.value = `${filename}\n\n`;
    textBox.focus();
  }

  continueBtn.addEventListener('click', handleFilenameSubmit);
  filenameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleFilenameSubmit();
    }
  });
});

// Prevent scroll on focus
textBox.addEventListener('focus', (e) => {
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
textBox.addEventListener('input', () => {
  textBox.scrollTop = textBox.scrollHeight;
});

// Handle bullet points
textBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const lines = textBox.value.split('\n');
    const lastLine = lines[lines.length - 1];
    const isBullet = lastLine.startsWith('- ');
    const isEmptyBullet = lastLine.trim() === '-' || lastLine.trim() === '- ';
  
    if (isBullet) {
      e.preventDefault();
      if (isEmptyBullet) {
        // Remove the empty bullet point and add a new line
        textBox.value = textBox.value.slice(0, -lastLine.length - 1) + '\n';
        textBox.scrollTop = textBox.scrollHeight;
      } else {
        // Add a new bullet point
        textBox.value = textBox.value + '\n- ';
        textBox.scrollTop = textBox.scrollHeight;
      }
    }
  }
});

// Download functionality
downloadBtn.addEventListener('click', () => {
  const text = textBox.value;
  const blob = new Blob([text], { type: 'text/plain' });
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
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

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

  document.body.removeChild(textArea);
}

copyBtn.addEventListener('click', () => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textBox.value)
      .then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      })
      .catch(() => {
        fallbackCopyToClipboard(textBox.value);
      });
  } else {
    fallbackCopyToClipboard(textBox.value);
  }
});

    // Handle viewport changes
if (window.visualViewport) {
  let maxVisualHeight = window.innerHeight;
      
  function handleViewportChange() {
    const visualHeight = window.visualViewport.height;
    document.documentElement.style.height = `${visualHeight}px`;
    document.body.style.height = `${visualHeight}px`;

    // Update max height if current height is larger
    if (visualHeight > maxVisualHeight) {
      maxVisualHeight = visualHeight;
    }

    // Check if keyboard is likely open (using 70% threshold)
    const keyboardThreshold = maxVisualHeight * 0.7;
    const isKeyboardOpen = visualHeight < keyboardThreshold;

    const buttonContainer = document.querySelector('.button-container');
    const textBoxContainer = document.querySelector('.text-box-container');

    if (isKeyboardOpen) {
      buttonContainer.style.display = 'none';
      textBoxContainer.style.marginBottom = '0';
          
      // Calculate remaining space and set text box height
      const pipHeight = document.querySelector('.pip-container').offsetHeight;
      const topSpacerHeight = document.querySelector('.fullpip-top-spacer').offsetHeight;
      // Add padding to prevent overlap with keyboard
      const keyboardPadding = 20; // Adjust this value if needed
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
      
  // Initial setup
  window.addEventListener('load', () => {
    maxVisualHeight = window.innerHeight;
    setTimeout(handleViewportChange, 100);
  });
}