import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  logo1: {
    type: String,
  },
  logo2: {
    type: String,
  },
  logo3: {
    type: String,
  },logo4: {
  type: String,
},
logo5: {
  type: String,
},
logo6: {
  type: String,
},
  activeWebsiteLogo: {
  type: String,
  enum: ['logo1', 'logo2', 'logo3', 'logo4', 'logo5', 'logo6'],
  default: 'logo1'
},
  favicon: {
    type: String,
  },
  top: {
    hideDarkMode: {
      type: Boolean,
      default: false
    },
    hideFavourite: {
      type: Boolean,
      default: false
    },
    hideLogo: {
      type: Boolean,
      default: false
    }
  },
  footer: {
    col1Heading: {
      type: String,
      default: ''
    },
    col2Heading: {
      type: String,
      default: ''
    },
    col3Heading: {
      type: String,
      default: ''
    }
  },
  recaptcha: {
    siteKey: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive'
    }
  },
  analytics: {
    trackingId: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive'
    }
  },
  cookieConsent: {
    message: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: 'ACCEPT'
    },
    textColor: {
      type: String,
      default: '#000000'
    },
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    buttonTextColor: {
      type: String,
      default: '#ffffff'
    },
    buttonBgColor: {
      type: String,
      default: '#000000'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive'
    }
  },
  themeColor: {
    darkModeBg: {
      type: String,
      default: '#000000'
    },
    darkModeText: {
      type: String,
      default: '#ffffff'
    }
  }
}, {
  timestamps: true
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);