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
    const voices = this.synth.getVoices();
    // Prefer Neural or Premium voices if available
    // Common high-quality voices: Google US English, Apple Samantha, Microsoft Aria
    this.voice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
                 voices.find(v => v.name.includes('Samantha') && v.lang.startsWith('en')) ||
                 voices.find(v => v.name.includes('Aria') && v.lang.startsWith('en')) ||
                 voices.find(v => v.lang.startsWith('en')) ||
                 voices[0];
  }

  /**
   * Speak a phrase
   * @param {string} text - The text to speak
   * @param {Object} options - Override options (onStart, onEnd, rate, pitch)
   */
  speak(text, options = {}) {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
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
