'use strict';


class oscillator {

	setup(rate, sineWave) {
		this.sampleRate = rate;
		this.sineWave = true;
		this.volume = 1.0;
		this.phaseAdder = 0.1;
		this.phase = 0;
		//	this.phaseAdderTarget = 0.1;		// smoothing??
	}

	setFrequency(freq) {
		this.frequency = freq;
		this.phaseAdder = (this.frequency * Math.PI * 2) / this.sampleRate;
	}

	setVolume(vol) {
		this.volume = vol;
	}

	map_range(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}

	getSample() {

		this.phase += this.phaseAdder;
		while (this.phase > Math.PI * 2) {
			this.phase -= Math.PI * 2;
		}

		if (this.sineWave === true) {
			return Math.sin(this.phase) * this.volume;
		} else {
			var pct = this.phase / (Math.PI * 2);
			return (pct < 0.5 ? this.map_range(pct, 0, 0.5, -1, 1) : this.map_range(pct, 0.5, 1.0, 1, -1)) * this.volume;
		}
	}

};