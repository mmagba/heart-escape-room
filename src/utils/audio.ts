"use client";

type SoundType = 'hover' | 'click' | 'error' | 'success' | 'victory' | 'ambient';

class AudioController {
    private ctx: AudioContext | null = null;
    private ambientGain: GainNode | null = null;
    private ambientOsc: OscillatorNode | null = null;

    private initContext() {
        if (typeof window === 'undefined') return;
        if (!this.ctx) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1, delay: number = 0) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration);
    }

    public play(type: SoundType) {
        this.initContext();
        if (!this.ctx) return;

        switch (type) {
            case 'hover':
                this.playTone(600, 'sine', 0.1, 0.02);
                break;
            case 'click':
                this.playTone(800, 'sine', 0.1, 0.05);
                break;
            case 'error':
                this.playTone(150, 'sawtooth', 0.3, 0.1);
                this.playTone(100, 'sawtooth', 0.4, 0.1, 0.15);
                break;
            case 'success':
                this.playTone(400, 'sine', 0.1, 0.05);
                this.playTone(600, 'sine', 0.1, 0.05, 0.1);
                this.playTone(1000, 'sine', 0.3, 0.05, 0.2);
                break;
            case 'victory':
                this.playTone(400, 'square', 0.2, 0.05);
                this.playTone(500, 'square', 0.2, 0.05, 0.2);
                this.playTone(600, 'square', 0.2, 0.05, 0.4);
                this.playTone(800, 'square', 0.4, 0.05, 0.6);
                break;
            case 'ambient':
                // A low subtle heartbeat thrum
                if (!this.ambientOsc) {
                    this.ambientOsc = this.ctx.createOscillator();
                    this.ambientGain = this.ctx.createGain();
                    this.ambientOsc.type = 'sine';
                    this.ambientOsc.frequency.value = 50; // Low hum
                    this.ambientGain.gain.value = 0.02;
                    this.ambientOsc.connect(this.ambientGain);
                    this.ambientGain.connect(this.ctx.destination);
                    this.ambientOsc.start();
                }
                break;
        }
    }

    public stopAmbient() {
        if (this.ambientOsc && this.ambientGain) {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + 1);
            setTimeout(() => {
                this.ambientOsc?.stop();
                this.ambientOsc?.disconnect();
                this.ambientGain?.disconnect();
                this.ambientOsc = null;
                this.ambientGain = null;
            }, 1000);
        }
    }
}

export const audioPlayer = new AudioController();
