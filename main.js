function add_adverb_slot() {
    let parent = this.closest('.adverb-block');
    parent.querySelectorAll('input').forEach(
	inp => inp.removeEventListener('change', add_adverb_slot));
    const template = document.querySelector('#adverb-row');
    let clone = document.importNode(template.content, true);
    clone.querySelector('input.adverb-lemma').addEventListener(
	'change', add_adverb_slot);
    parent.appendChild(clone);
}

function add_verb() {
    let target = document.getElementById('inputs');
    const template = document.querySelector('#verb-block');
    let clone = document.importNode(template.content, true);
    target.appendChild(clone);
    let target2 = target.querySelector('.adverb-block');
    const template2 = document.querySelector('#adverb-row');
    let clone2 = document.importNode(template2.content, true);
    target2.appendChild(clone2);
    target2.querySelector('input.adverb-lemma').addEventListener(
	'change', add_adverb_slot);
}

function make_option_list(id, dct) {
    return document.getElementById(id).innerHTML = Object.keys(dct).map(
	k => `<option value="${k}">${k}</option>`).join('');
}

const lookup = {
    'verb-lemma': verbs,
    'adverb-lemma': adverbs,
    'subj-agr': subject_suffix,
    'obj-agr': object_prefix,
    'iobj-agr': indirect_object_prefix,
    'mood': mood_prefix,
    'voice': voice_prefix,
};

function parse_phoneme_string(s) {
    return Array.from(s.matchAll(/([^0-9])(\d*)/g)).map(
	x => {return {p: x[1], t: parseInt(x[2] || '0')};});
}

function shift_tones(seq) {
    let index = [];
    seq.forEach((x, i) => {
	if (x.t > 0) {
	    index.push(i);
	}
    });
    for (let count = 0; count <= index.length; count++) {
	let changed = false;
	for (let i = 0; i+1 < index.length; i++) {
	    let a = index[i];
	    let b = index[i+1];
	    if (seq[a].t != seq[b].t) {
		continue;
	    }
	    let ap = phonemes[seq[a].p];
	    let bp = phonemes[seq[b].p];
	    if (ap.c <= bp.c) {
		if (seq[a].t == 1) {
		    seq[b].t = 2;
		} else {
		    seq[a].t -= 1;
		}
	    } else {
		if (seq[a].t == 1) {
		    seq[a].t = 2;
		} else {
		    seq[b].t -= 1;
		}
	    }
	}
    }
    return seq;
}

function render_word(seq) {
    const has_omega = seq.some(x => (x.p == 'ω'));
    console.log(seq, 'has_omega', has_omega);
    let prev_vowel = false;
    let form = '';
    let phono = '<table>';
    for (let i = 0; i < seq.length; i++) {
	let c = seq[i];
	let next_vowel = (((i + 1) < seq.length) &&
			  phonemes[seq[i+1].p].va);
	let p = phonemes[c.p];
	let subform = '';
	if (prev_vowel && has_omega) {
	    subform += p.da || p.a || '';
	} else {
	    subform += p.a || '';
	}
	subform += (has_omega ? (p.dm || p.m) : p.m);
	if (next_vowel && has_omega) {
	    subform += p.dz || p.z || '';
	} else {
	    subform += p.z || '';
	}
	let tn = (c.t ? tone_names[c.t] : '');
	phono += `<tr><td>${c.p}</td><td>${subform}</td><td>${tn}</td></tr>`;
	form += c.p + (c.t ? tones[c.t] : '');
	prev_vowel = p.vz;
    }
    phono += '</table>';
    return {form: form, table: phono};
}

function collapse_seq(seq) {
    return seq.map(c => (c.p + (c.t ? c.t : ''))).join('');
}

function update_verb_block(block) {
    let seq = Array.from(block.querySelectorAll('.component')).map(
	el => {
	    return {
		pos: parseInt(el.getAttribute('data-pos')),
		val: el.getAttribute('data-form') || '',
	    };
	});
    seq.sort((a, b) => (a.pos - b.pos));
    let underlying = seq.map(x => x.val).join('');
    let phoneme_seq = parse_phoneme_string(underlying);
    let post_tone = shift_tones(phoneme_seq.slice());
    let data = render_word(post_tone);
    let sum = block.querySelector('summary.final-form');
    sum.innerHTML = data.form;
    let out = block.querySelector('div.conjugation-info');
    out.innerHTML = `<p>Underlying: ${underlying}</p><p>Tone Shift: ${collapse_seq(post_tone)}</p><p>Surface: ${data.form}</p><p>Phonetic:</p>${data.table}`;
}

function update_adverb_block(block) {
    block.setAttribute(
	'data-form',
	Array.from(block.querySelectorAll('tr.adverb')).map(
	    el => el.getAttribute('data-form') || '').join(''));
}

function update_morpheme(input, output) {
    let val = input.value;
    let cls = input.className;
    let row = input.closest('tr');
    if (!val || !lookup.hasOwnProperty(cls)) {
	output.innerHTML = '';
	row.setAttribute('data-form', '');
    } else {
	const dct = lookup[cls];
	if (dct.hasOwnProperty(val)) {
	    const dct2 = dct[val];
	    output.innerHTML = Object.keys(dct2).map(
		k => `${k}: ${dct2[k]}<br/>`).join('');
	    row.setAttribute('data-form', dct2.form);
	} else {
	    output.innerHTML = 'unknown morpheme';
	    row.setAttribute('data-form', '');
	}
    }
    if (cls == 'adverb-lemma') {
	update_adverb_block(row.closest('.component'));
    }
    update_verb_block(row.closest('.verb-block'));
}

function setup() {
    for (let k in lookup) {
	make_option_list(k, lookup[k]);
    }
    add_verb();
    document.addEventListener('change', function(e) {
	let target = e.target.closest('input');
	if (target) {
	    let output = target.closest('tr').querySelector('span.display');
	    if (output) {
		update_morpheme(target, output);
	    }
	}
    });
}

setup();
