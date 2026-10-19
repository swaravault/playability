/**
 * SpeechService - A utility for browser Text-to-Speech (Web Speech API)
 * Optimized for clear articulation and children's accessibility.
 */

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voice = null;
    this.rate = 0.85; // Slightly slower for better articulation
    this.pitch = 1.1; // Slightly higher pitch for child-friendly feel
    
    if (this.synth) {
      // Load voices and select the best one
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
    // Prioritize English (India) then other high-quality English voices
    this.voice = this.voices.find(v => v.lang === 'en-IN') ||
                 this.voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
                 this.voices.find(v => v.name.includes('Samantha') && v.lang.startsWith('en')) ||
                 this.voices.find(v => v.name.includes('Aria') && v.lang.startsWith('en')) ||
                 this.voices.find(v => v.lang.startsWith('en')) ||
                 this.voices[0];
  }

  getAvailableVoices() {
    if (!this.synth) return [];
    return this.synth.getVoices().filter(v => v.lang.startsWith('en'));
  }

  /**
   * Speak a phrase
   * @param {string} text - The text to speak
   * @param {Object} options - Override options (onStart, onEnd, rate, pitch, voice)
   */
  speak(text, options = {}) {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use specified voice by URI or name, fallback to default
    if (options.voice) {
      const selectedVoice = this.synth.getVoices().find(v => v.voiceURI === options.voice || v.name === options.voice);
      utterance.voice = selectedVoice || this.voice;
    } else {
      utterance.voice = this.voice;
    }

    utterance.rate = options.rate || this.rate;
    utterance.pitch = options.pitch || this.pitch;

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
export default speechService;
