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
    let target2 = target.lastElementChild.querySelector('.adverb-block');
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
    let prev_vowel = false;
    let form = '';
    let phono = '<table>';
    let num = 0;
    for (let i = 0; i < seq.length; i++) {
	let c = seq[i];
	let next_vowel = (((i + 1) < seq.length) &&
			  phonemes[seq[i+1].p].va);
	let p = phonemes[c.p];
	num += p.n;
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
    return {form: form, table: phono, numerology: num};
}

function collapse_seq(seq) {
    return seq.map(c => (c.p + (c.t ? c.t : ''))).join('');
}

function update_json_export() {
    let seq = Array.from(document.querySelectorAll('.verb-block')).map(
	b => JSON.parse(b.getAttribute('data-json') || '{}'));
    document.getElementById('json-blob').value = JSON.stringify(seq);
}

function get_word_polarity(seq) {
    let ct = {N: 0, E: 0, S: 0, W: 0, '∅': 0};
    seq.forEach(m => {
	if ([1, 2, 4, 5, 7].includes(m.pos)) {
	    if (ct.hasOwnProperty(m.polarity)) {
		ct[m.polarity] += 1;
	    }
	}
    });
    let ret = {
	major: '∅',
	minor: [],
    };
    const dirs = ['N', 'E', 'S', 'W', '∅'];
    dirs.forEach(d => {
	if (ct[d] > 0) {
	    if (!dirs.some(d2 => (ct[d] > ct[d2] && ct[d2] > 0))) {
		ret.minor.push(d);
	    }
	    if (!dirs.some(d2 => (d2 != d && ct[d2] >= ct[d]))) {
		ret.major = d;
	    }
	}
    });
    return ret;
}

function arrange_words() {
    let seq = Array.from(document.querySelectorAll('.verb-block')).map(
	b => {
	    return {
		p: JSON.parse(b.getAttribute('data-polarity')
			      || '{"major": "", "minor": []}'),
		f: b.getAttribute('data-form'),
	    };
	});
    let major = parseInt(document.getElementById('major_force').value);
    let minor = parseInt(document.getElementById('minor_force').value);
    const push = {
	NN: 1, NS: -1, SS: 1, SN: -1,
	WW: 1, WE: -1, EE: 1, EW: 1,
    };
    let add = function(x, y) { return x + y; };
    let comp = function(a, b) {
	let maj = push[a.major + b.major] || 0;
	let min = a.minor.map(ad => b.minor.map(
	    bd => push[ad+bd] || 0).reduce(add, 0)).reduce(add, 0);
	return maj*major + min*minor;
    };
    let dist = seq.map((wi, i) => seq.map((wj, j) => {
	if (i == j) {
	    return 0;
	}
	return comp(wi.p, wj.p);
    }));
    let order = [0];
    for (let idx = 1; idx < seq.length; idx++) {
	let best = -1;
	let best_score = (major+minor) * seq.length * 100;
	for (let pos = 0; pos <= order.length; pos++) {
	    let score = order.map(
		(w, i) => (dist[w][idx] *
			   (0.5 + Math.abs(pos - 0.5 - i)))).reduce(add, 0);
	    if (score <= best_score) {
		best_score = score;
		best = pos;
	    }
	}
	order = order.slice(0, best).concat([idx], order.slice(best));
    }
    let r1 = order.map(n => `<td>${n+1}</td>`).join('');
    let r2 = order.map(n => `<td>${seq[n].f}</td>`).join('');
    let para = order.map(n => seq[n].f).join(' ');
    document.getElementById('order').innerHTML = `<p>${para}</p><table><tr>${r1}</tr><tr>${r2}</tr></table>`;
}

function update_verb_block(block) {
    let seq = Array.from(block.querySelectorAll('.component')).map(
	el => {
	    return {
		pos: parseInt(el.getAttribute('data-pos')),
		val: el.getAttribute('data-form') || '',
		json: JSON.parse(el.getAttribute('data-lemma') || '""'),
		polarity: el.getAttribute('data-polarity') || '',
	    };
	});
    block.setAttribute('data-json', JSON.stringify(seq));
    seq.sort((a, b) => (a.pos - b.pos));
    let underlying = seq.map(x => x.val).join('');
    let phoneme_seq = parse_phoneme_string(underlying);
    let post_tone = shift_tones(phoneme_seq.slice());
    let data = render_word(post_tone);
    let sum = block.querySelector('summary.final-form');
    sum.innerHTML = data.form;
    let out = block.querySelector('div.conjugation-info');
    let pol = get_word_polarity(seq);
    out.innerHTML = `<p>Underlying: ${underlying}</p><p>Tone Shift: ${collapse_seq(post_tone)}</p><p>Surface: ${data.form}</p><p>Numerological Value: ${data.numerology}</p><p>Major Polarity: ${pol.major}</p><p>Minor Polarities: ${pol.minor.join(', ')}</p><p>Phonetic:</p>${data.table}`;
    update_json_export();
    block.setAttribute('data-polarity', JSON.stringify(pol));
    block.setAttribute('data-form', data.form);
    arrange_words();
}

function update_adverb_block(block) {
    block.setAttribute(
	'data-form',
	Array.from(block.querySelectorAll('tr.adverb')).map(
	    el => el.getAttribute('data-form') || '').join(''));
    block.setAttribute(
	'data-lemma',
	JSON.stringify(
	    Array.from(block.querySelectorAll('input.adverb-lemma')).map(
		el => el.value)));
}

function update_morpheme(input, output) {
    let val = input.value;
    let cls = input.className;
    let row = input.closest('tr');
    row.setAttribute('data-polarity', '∅');
    if (!val || !lookup.hasOwnProperty(cls)) {
	output.innerHTML = '';
	row.setAttribute('data-form', '');
	row.setAttribute('data-lemma', '');
    } else {
	const dct = lookup[cls];
	if (dct.hasOwnProperty(val)) {
	    const dct2 = dct[val];
	    output.innerHTML = Object.keys(dct2).map(
		k => `${k}: ${dct2[k]}<br/>`).join('');
	    row.setAttribute('data-form', dct2.form);
	    if (dct2.p) {
		row.setAttribute('data-polarity', dct2.p);
	    }
	} else {
	    output.innerHTML = 'unknown morpheme';
	    row.setAttribute('data-form', '');
	}
	row.setAttribute('data-lemma', JSON.stringify(val));
    }
    if (cls == 'adverb-lemma') {
	update_adverb_block(row.closest('.component'));
    }
    update_verb_block(row.closest('.verb-block'));
}

function get_display(target) {
    let row = target.closest('tr');
    if (row) {
	return row.querySelector('span.display');
    }
}

function import_json() {
    let data = JSON.parse(document.getElementById('json-blob').value);
    let div = document.getElementById('inputs');
    div.innerHTML = '';
    data.forEach(blob => {
	add_verb();
	let vb = div.lastElementChild;
	blob.forEach(morph => {
	    let p = parseInt(morph.pos);
	    let v = morph.json;
	    if (isNaN(p) || !v) {
		return;
	    }
	    if (p == 3) {
		v.forEach(
		    v2 => {
			if (!v2) {
			    return;
			}
			let inp = vb.querySelector('table.adverb-block tr:last-of-type input');
			if (inp) {
			    inp.value = v2;
			    update_morpheme(inp, get_display(inp));
			}
		    });
	    } else {
		let inp = vb.querySelector(`tr[data-pos="${p}"] input`);
		if (inp) {
		    inp.value = v;
		    update_morpheme(inp, get_display(inp));
		}
	    }
	});
    });
}

function setup() {
    for (let k in lookup) {
	make_option_list(k, lookup[k]);
    }
    add_verb();
    document.addEventListener('change', function(e) {
	let target = e.target.closest('input');
	if (target) {
	    let output = get_display(target);
	    if (output) {
		update_morpheme(target, output);
	    }
	}
    });
}

setup();
