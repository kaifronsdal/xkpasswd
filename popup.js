// Preset configurations based on xkpasswd.net presets
const PRESETS = {
  KAI_DEFAULT: {
    description: 'Kai\'s default preset resulting in a password consisting of 4 random words of between 4 and 8 letters with alternating case separated by a random character, with two random digits and two random characters after.',
    config: {
      word_length_min: 4,
      word_length_max: 8,
      num_words: 4,
      case_transform: 'ALTERNATE',
      separator_type: 'RANDOM',
      separator_alphabet: '-+=.*_|~',
      padding_digits_before: 0,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character_type: 'RANDOM',
      padding_alphabet: '!@$%^&*+=:|~',
      padding_characters_before: 0,
      padding_characters_after: 2,
      allow_accents: 0
    }
  },
  DEFAULT: {
    description: 'The default preset resulting in a password consisting of 3 random words of between 4 and 8 letters with alternating case separated by a random character, with two random digits before and after, and padded with two random characters front and back.',
    config: {
      word_length_min: 4,
      word_length_max: 8,
      num_words: 3,
      case_transform: 'CAPITALISE',
      separator_type: 'RANDOM',
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character_type: 'RANDOM',
      padding_characters_before: 2,
      padding_characters_after: 2
    }
  },
  WEB32: {
    description: 'A preset for websites that allow passwords up to 32 characters long.',
    config: {
      word_length_min: 4,
      word_length_max: 5,
      num_words: 4,
      case_transform: 'ALTERNATE',
      separator_type: 'RANDOM',
      separator_alphabet: '-+=.*_|~',
      padding_digits_before: 2,
      padding_digits_after: 3,
      padding_type: 'FIXED',
      padding_character_type: 'RANDOM',
      padding_alphabet: '!@$%^&*+=:|~',
      padding_characters_before: 1,
      padding_characters_after: 1,
      allow_accents: 0
    }
  },
  WIFI: {
    description: 'A preset for generating 63 character long WPA2 keys (most routers allow 64 characters, but some only 63, hence the odd length).',
    config: {
      word_length_min: 4,
      word_length_max: 8,
      num_words: 6,
      case_transform: 'RANDOM',
      separator_type: 'RANDOM',
      separator_alphabet: '-+=.*_|~,',
      padding_type: 'ADAPTIVE',
      pad_to_length: 63,
      padding_digits_before: 4,
      padding_digits_after: 4,
      padding_character_type: 'RANDOM',
      padding_alphabet: '!@$%^&*+=:|~?',
      allow_accents: 0
    }
  },
  APPLEID: {
    description: 'A preset respecting the many prerequisites Apple places on Apple ID passwords. The preset also limits itself to symbols found on the iOS letter and number keyboards (i.e. not the awkward to reach symbol keyboard).',
    config: {
      word_length_min: 4,
      word_length_max: 7,
      num_words: 3,
      case_transform: 'RANDOM',
      separator_type: 'RANDOM',
      separator_alphabet: '-:.@}',
      padding_type: 'FIXED',
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_character_type: 'RANDOM',
      padding_characters_before: 1,
      padding_characters_after: 1,
      padding_alphabet: '-:.!?@&',
      allow_accents: 0
    }
  },
  NTLM: {
    description: 'A preset for 14 character Windows NTLMv1 password. WARNING - only use this preset if you have to, it is too short to be acceptably secure and will always generate entropy warnings for the case where the config and dictionary are known.',
    config: {
      word_length_min: 5,
      word_length_max: 5,
      num_words: 2,
      case_transform: 'INVERT',
      separator_type: 'RANDOM',
      separator_alphabet: '-+=.*_|~,',
      padding_digits_before: 1,
      padding_digits_after: 0,
      padding_type: 'FIXED',
      padding_character_type: 'RANDOM',
      padding_characters_before: 0,
      padding_characters_after: 1,
      padding_alphabet: '!@$%^&*+=:|~?',
      allow_accents: 0
    }
  },
  SECURITYQ: {
    description: 'A preset for creating fake answers to security questions.',
    config: {
      word_length_min: 4,
      word_length_max: 8,
      num_words: 6,
      case_transform: 'NONE',
      separator_type: 'FIXED',
      separator_character: ' ',
      padding_digits_before: 0,
      padding_digits_after: 0,
      padding_type: 'FIXED',
      padding_character_type: 'RANDOM',
      padding_alphabet: '.!?',
      padding_characters_before: 0,
      padding_characters_after: 1,
      allow_accents: 0
    }
  }
};

// Global XKPasswd instance
let xkpasswdInstance = null;

// Track the previously selected preset to initialize CUSTOM
let previousPreset = 'KAI_DEFAULT';

// Initialize XKPasswd library
function initializeXkpasswd() {
  if (!xkpasswdInstance) {
    console.log('Initializing XKPasswd...');
    xkpasswdInstance = new XKPasswd();
    console.log('XKPasswd initialized successfully');
  }
  return xkpasswdInstance;
}

// Update statistics display
function updateStatistics(password, stats) {
  const statisticsDiv = document.getElementById('statistics');
  
  // Show statistics
  statisticsDiv.style.display = 'block';
  
  // Update length
  document.getElementById('statLength').textContent = password.length;
  
  // Extract entropy values from the actual structure
  const entropy = stats.entropy || {};
  const blindMin = entropy.minEntropyBlind?.value || 0;
  const blindMax = entropy.maxEntropyBlind?.value || 0;
  const seen = entropy.entropySeen?.value || 0;
  
  // Get password strength from the stats
  const passwordStrength = stats.password?.passwordStrength || 'OK';
  
  // Update strength badge with color based on value
  const strengthElement = document.getElementById('statStrength');
  let strengthClass = 'ok';
  
  switch (passwordStrength.toUpperCase()) {
    case 'EXCELLENT':
      strengthClass = 'excellent';
      break;
    case 'GOOD':
      strengthClass = 'good';
      break;
    default:
      strengthClass = 'ok';
  }
  
  strengthElement.className = `stat-badge ${strengthClass}`;
  strengthElement.textContent = passwordStrength.toUpperCase();
  
  // Update entropy values with color coding based on security thresholds
  const blindElement = document.getElementById('entropyBlind');
  const fullElement = document.getElementById('entropyFull');
  const knownElement = document.getElementById('entropyKnown');
  
  blindElement.textContent = `${Math.round(blindMin)} bits`;
  fullElement.textContent = `${Math.round(blindMax)} bits`;
  knownElement.textContent = `${Math.round(seen)} bits`;
  
  // Color code entropy badges based on security thresholds
  // Blind entropy: good if >= 78 bits (recommended threshold)
  blindElement.className = blindMin >= 78 ? 'entropy-badge blind good' : 'entropy-badge blind warning';
  
  // Full entropy: good if >= 78 bits  
  fullElement.className = blindMax >= 78 ? 'entropy-badge full good' : 'entropy-badge full warning';
  
  // Known entropy: good if >= 52 bits (recommended threshold)
  knownElement.className = seen >= 52 ? 'entropy-badge known good' : 'entropy-badge known warning';
}

// Generate password using the official library
function generateXkpasswd() {
  try {
    const xkpasswd = initializeXkpasswd();
    
    // Use the XKPasswd library with configuration
    const selectedPreset = document.getElementById('preset').value;
    
    if (selectedPreset === 'CUSTOM') {
      // Apply custom configuration
      const config = getPasswordConfig();
      xkpasswd.setCustomPreset(config);
    } else if (PRESETS[selectedPreset]) {
      // Use our custom preset (like KAI_DEFAULT)
      const presetConfig = PRESETS[selectedPreset].config;
      
      xkpasswd.setCustomPreset(presetConfig);
    } else {
      // Use built-in library preset
      xkpasswd.setPreset(selectedPreset);
    }
    
    // Generate password with statistics
    const result = xkpasswd.generatePassword(1);
    const password = result.passwords[0];
    const stats = result.stats;
    
    console.log('Generated password:', password);
    console.log('Password stats:', stats);
    
    // Update UI with statistics
    updateStatistics(password, stats);
    
    return password;
  } catch (error) {
    console.error('Failed to generate password:', error);
    throw error;
  }
}

// Get password configuration from UI settings
function getPasswordConfig() {
  const numWords = parseInt(document.getElementById('numWords').value);
  const minWordLength = parseInt(document.getElementById('minWordLength').value);
  const maxWordLength = parseInt(document.getElementById('maxWordLength').value);
  const caseTransform = document.getElementById('caseTransform').value;
  const separatorType = document.getElementById('separatorType').value;
  const separatorChar = document.getElementById('separatorChar').value;
  const paddingDigitsBefore = parseInt(document.getElementById('paddingDigitsBefore').value);
  const paddingDigitsAfter = parseInt(document.getElementById('paddingDigitsAfter').value);
  const paddingCharsBefore = parseInt(document.getElementById('paddingCharsBefore').value);
  const paddingCharsAfter = parseInt(document.getElementById('paddingCharsAfter').value);
  
  let separator;
  if (separatorType === 'RANDOM') {
    separator = 'RANDOM';
  } else if (separatorType === 'SPECIFIED') {
    separator = separatorChar;
  } else {
    separator = '';
  }
  
  return {
    num_words: numWords,
    word_length_min: minWordLength,
    word_length_max: maxWordLength,
    case_transform: caseTransform,
    separator_character: separator,
    padding_digits_before: paddingDigitsBefore,
    padding_digits_after: paddingDigitsAfter,
    padding_characters_before: paddingCharsBefore,
    padding_characters_after: paddingCharsAfter,
    padding_type: 'FIXED'
  };
}

// Update UI based on selected preset
function updatePreset() {
  const selectedPreset = document.getElementById('preset').value;
  const customSettings = document.getElementById('customSettings');
  const presetDescription = document.getElementById('presetDescription');
  const separatorCharGroup = document.getElementById('separatorCharGroup');
  
  if (selectedPreset === 'CUSTOM') {
    customSettings.classList.add('visible');
    presetDescription.textContent = 'Configure your own custom password generation settings.';
    
    // Initialize CUSTOM with the previous preset's configuration
    const previousPresetConfig = PRESETS[previousPreset];
    if (previousPresetConfig) {
      loadPresetValues(previousPresetConfig.config);
    }
  } else {
    customSettings.classList.remove('visible');
    const preset = PRESETS[selectedPreset];
    if (preset) {
      presetDescription.textContent = preset.description;
      // Load preset values into form
      loadPresetValues(preset.config);
    }
    
    // Update the previous preset tracker (only for non-CUSTOM presets)
    if (selectedPreset !== 'CUSTOM') {
      previousPreset = selectedPreset;
    }
  }
  
  // Show/hide separator character input
  const separatorType = document.getElementById('separatorType').value;
  if (separatorType === 'SPECIFIED') {
    separatorCharGroup.style.display = 'block';
  } else {
    separatorCharGroup.style.display = 'none';
  }
}

// Load preset values into the form
function loadPresetValues(config) {
  document.getElementById('numWords').value = config.num_words;
  document.getElementById('minWordLength').value = config.word_length_min;
  document.getElementById('maxWordLength').value = config.word_length_max;
  document.getElementById('caseTransform').value = config.case_transform;
  document.getElementById('paddingDigitsBefore').value = config.padding_digits_before;
  document.getElementById('paddingDigitsAfter').value = config.padding_digits_after;
  document.getElementById('paddingCharsBefore').value = config.padding_characters_before;
  document.getElementById('paddingCharsAfter').value = config.padding_characters_after;
  
  // Handle separator
  if (config.separator_type === 'RANDOM') {
    document.getElementById('separatorType').value = 'RANDOM';
  } else if (config.separator_type === 'FIXED' && config.separator_character) {
    document.getElementById('separatorType').value = 'SPECIFIED';
    document.getElementById('separatorChar').value = config.separator_character;
  } else {
    document.getElementById('separatorType').value = 'NONE';
  }
}

// Auto-resize textarea based on content
function autoResizeTextarea(textarea) {
  // Reset height to minimum to get accurate scrollHeight
  textarea.style.height = '40px';
  
  // Calculate the required height
  const scrollHeight = textarea.scrollHeight;
  const minHeight = 40;
  
  // Set the height to fit content (no max limit)
  const newHeight = Math.max(minHeight, scrollHeight);
  textarea.style.height = newHeight + 'px';
}

// Create a single password item DOM element
function createPasswordItem(password, index) {
  const passwordItem = document.createElement('div');
  passwordItem.className = 'password-item';
  passwordItem.innerHTML = `
    <textarea class="password-textarea" data-index="${index}" placeholder="Password ${index + 1}...">${password}</textarea>
    <button class="copy-icon" data-index="${index}" title="Copy to clipboard">
      <i class="bi" style="font-family: 'bootstrap-icons'; font-style: normal; speak: none;">&#xf759;</i>
    </button>
  `;
  
  // Auto-resize the textarea
  const textarea = passwordItem.querySelector('.password-textarea');
  // Use setTimeout to ensure the DOM is updated before calculating height
  setTimeout(() => {
    autoResizeTextarea(textarea);
  }, 0);
  
  // Add event listeners
  textarea.addEventListener('input', function() {
    autoResizeTextarea(this);
  });
  
  const copyBtn = passwordItem.querySelector('.copy-icon');
  copyBtn.addEventListener('click', function() {
    copyPasswordToClipboard(index);
  });
  
  return passwordItem;
}

// Generate multiple passwords
function generatePasswords() {
  try {
    const numPasswords = parseInt(document.getElementById('numPasswords').value);
    const container = document.getElementById('passwordsContainer');
    
    // Clear existing passwords
    container.innerHTML = '';
    
    // Generate the requested number of passwords
    const passwords = [];
    let lastStats = null;
    
    for (let i = 0; i < numPasswords; i++) {
      const password = generateXkpasswd();
      passwords.push(password);
      
      // Get stats from the last generated password for display
      if (i === numPasswords - 1) {
        const xkpasswd = initializeXkpasswd();
        const result = xkpasswd.generatePassword(1);
        lastStats = result.stats;
      }
    }
    
    // Create DOM elements for each password
    passwords.forEach((password, index) => {
      const passwordItem = createPasswordItem(password, index);
      container.appendChild(passwordItem);
    });
    
    // Update statistics with the last generated password
    if (lastStats && passwords.length > 0) {
      updateStatistics(passwords[passwords.length - 1], lastStats);
    }
    
    
  } catch (error) {
    console.error('Failed to generate passwords:', error);
    const container = document.getElementById('passwordsContainer');
    container.innerHTML = '<div class="password-item"><textarea class="password-textarea" readonly>Error: Failed to generate passwords</textarea></div>';
  }
}

// Copy all passwords to clipboard
function copyAllPasswords() {
  const textareas = document.querySelectorAll('.password-textarea');
  const passwords = Array.from(textareas).map(textarea => textarea.value).filter(password => password.trim());
  
  if (passwords.length === 0) return;
  
  const allPasswordsText = passwords.join('\n');
  
  // Use the modern clipboard API if available, fallback to legacy method
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(allPasswordsText);
  } else {
    // Fallback for older browsers or non-HTTPS
    const tempInput = document.createElement('textarea');
    tempInput.value = allPasswordsText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }
  
  // Provide visual feedback
  const copyAllBtn = document.getElementById('copyAllBtn');
  const iconElement = copyAllBtn.querySelector('i');
  const originalText = copyAllBtn.innerHTML;
  
  // Change to checkmark icon
  iconElement.innerHTML = '&#xf26e;'; // Bootstrap checkmark icon
  copyAllBtn.style.backgroundColor = '#1e7e34';
  copyAllBtn.title = `Copied ${passwords.length} password${passwords.length > 1 ? 's' : ''}!`;
  
  setTimeout(() => {
    // Change back to clipboard icon
    copyAllBtn.innerHTML = originalText;
    copyAllBtn.style.backgroundColor = '';
    copyAllBtn.title = 'Copy all passwords';
  }, 1000);
}

// Copy a specific password to clipboard
function copyPasswordToClipboard(index) {
  const textarea = document.querySelector(`.password-textarea[data-index="${index}"]`);
  const copyBtn = document.querySelector(`.copy-icon[data-index="${index}"]`);
  
  if (!textarea || !copyBtn) return;
  
  // Select and copy the password
  textarea.select();
  document.execCommand('copy');
  
  // Provide visual feedback with icon change
  const iconElement = copyBtn.querySelector('i');
  
  // Change to checkmark icon
  iconElement.innerHTML = '&#xf26e;'; // Bootstrap checkmark icon
  iconElement.style.fontStyle = 'normal';
  copyBtn.style.color = '#28a745';
  copyBtn.title = 'Copied!';
  
  setTimeout(() => {
    // Change back to clipboard icon
    iconElement.innerHTML = '&#xf759;'; // Bootstrap copy icon
    iconElement.style.fontStyle = 'normal';
    copyBtn.style.color = '';
    copyBtn.title = 'Copy to clipboard';
  }, 1000);
}

// Legacy function name for compatibility
function generatePassword() {
  generatePasswords();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('generateBtn').addEventListener('click', generatePasswords);
  document.getElementById('copyAllBtn').addEventListener('click', copyAllPasswords);
  document.getElementById('preset').addEventListener('change', updatePreset);
  document.getElementById('separatorType').addEventListener('change', updatePreset);
  
  // Add stepper button listeners
  const numPasswordsInput = document.getElementById('numPasswords');
  const decreaseBtn = document.getElementById('decreaseBtn');
  const increaseBtn = document.getElementById('increaseBtn');
  
  function updateStepperButtons() {
    const value = parseInt(numPasswordsInput.value);
    const min = parseInt(numPasswordsInput.min) || 1;
    const max = parseInt(numPasswordsInput.max) || 20;
    
    decreaseBtn.disabled = value <= min;
    increaseBtn.disabled = value >= max;
  }
  
  decreaseBtn.addEventListener('click', function() {
    const current = parseInt(numPasswordsInput.value);
    const min = parseInt(numPasswordsInput.min) || 1;
    if (current > min) {
      numPasswordsInput.value = current - 1;
      updateStepperButtons();
    }
  });
  
  increaseBtn.addEventListener('click', function() {
    const current = parseInt(numPasswordsInput.value);
    const max = parseInt(numPasswordsInput.max) || 20;
    if (current < max) {
      numPasswordsInput.value = current + 1;
      updateStepperButtons();
    }
  });
  
  // Add number input listener for manual typing
  numPasswordsInput.addEventListener('change', function() {
    let value = parseInt(this.value);
    const min = parseInt(this.min) || 1;
    const max = parseInt(this.max) || 20;
    
    // Clamp value within bounds
    if (isNaN(value) || value < min) {
      this.value = min;
    } else if (value > max) {
      this.value = max;
    }
    
    updateStepperButtons();
  });
  
  numPasswordsInput.addEventListener('input', function() {
    updateStepperButtons();
  });
  
  // Initialize UI
  updatePreset();
  updateStepperButtons();
  
  // Generate initial password
  generatePasswords();
});

// Auto-generate when custom settings change
const settingsInputs = [
  'numWords', 'minWordLength', 'maxWordLength', 'caseTransform', 
  'separatorType', 'separatorChar', 'paddingDigitsBefore', 'paddingDigitsAfter', 
  'paddingCharsBefore', 'paddingCharsAfter'
];

settingsInputs.forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener('change', () => {
      if (document.getElementById('preset').value === 'CUSTOM') {
        generatePasswords();
      }
    });
    element.addEventListener('input', () => {
      if (document.getElementById('preset').value === 'CUSTOM') {
        generatePasswords();
      }
    });
  }
});

// Auto-generate when preset changes
document.getElementById('preset').addEventListener('change', generatePasswords);