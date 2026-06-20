const tones = [
    'ERROR',
    '\x301',
    '\x300',
    '\x30c',
    '\x302',
    '\x306',
    '\x307',
    '\x308',
    '\x30a',
    '\x305',
    '\x332\x305',
    '\x33f',
    '\x332\x33f',
    '\x318',
    '\x329',
    '\x319',
    '\x303',
];

const tone_names = [
    "God Rest Ye Merry Gentlemen",
    "Hark the Herald Angels Sing",
    "Carol of the Bells",
    "Go, Tell it on the Mountains",
    "Good King Wenceslas",
    "O Little Town of Bethlehem",
    "O Little Town of Bethlehem (but staccato)",
    "O Holy Night",
    "Joy to the World",
    "Joy to the World (but loudly)",
    "Joy to the World (but repeat the vowel as many times as necessary to finish the first verse)",
    "Joy to the World (combine 10 and 11 = loud and repeated)",
    "Silent Night (but quietly)",
    "Silent Night",
    "Silent Night (but loudly)",
    "O Come, O Come Emmanuel",
];

/*
  a, m, z = start, mid, end
  da, dm, dz = devoiced
  va, vz = vowel start, end
  vnull = skip for devoicing
  c = column
  n = numerology
 */
const phonemes = {
    "æ": {
	a: "b",
	da: "p",
	m: "ɑdɑgɑmɑnɑlɑɹɑ",
	dm: "ɑtɑkɑm̥ɑn̥ɑl̥ɑɹ̥ɑ",
	vz: true,
	c: 1,
	n: 12,
    },
    "e": {
	a: "ʒ",
	da: "ʃ",
	m: "ɑɣɑɹɑʀɑʁɑ",
	dm: "ɑxɑɹ̥ɑʀ̥ɑʁ̥ɑ",
	vz: true,
	c: 2,
	n: 1,
    },
    "i": {
	a: "v",
	da: "f",
	m: "ɑðɑzɑʒɑɣɑʁɑɦɑ",
	dm: "ɑθɑsɑʃɑxɑχɑhɑ",
	vz: true,
	c: 3,
	n: 9.7,
    },
    "o": {
	m: "∅",
	vnull: true,
	c: 4,
	n: 2,
    },
    "u": {
	a: "m",
	da: "m̥",
	m: "ɑnɑlɑɹɑwɑjɑ",
	dm: "ɑn̥ɑl̥ɑɹ̥ɑʍɑj̥ɑ",
	vz: true,
	c: 5,
	n: 1,
    },
    "y": {
	a: "d",
	da: "t",
	m: "ɑnɑzɑlɑɾɑɹɑ",
	dm: "ɑn̥ɑsɑl̥ɑɾ̥ɑɹ̥ɑ",
	vz: true,
	c: 6,
	n: 3,
    },
    "w": {
	a: "b",
	da: "p",
	m: "ɑbʲɑdɑdʲɑgɑgʲɑ",
	dm: "ɑpʲɑtɑtʲɑkɑkʲɑ",
	vz: true,
	c: 7,
	n: 4,
    },
    "α": {
	m: "pɑtɑkɑm̥ɑn̥ɑl̥ɑɹ̥ɑ",
	vz: true,
	c: 1,
	n: 6,
    },
    "ε": {
	m: "ɑ",
	va: true,
	vz: true,
	c: 2,
	n: -20,
    },
    "ι": {
	m: "fɑθɑsɑʃɑxɑχɑhɑ",
	vz: true,
	c: 3,
	n: 7,
    },
    "ω": {
	m: "{C → [-voice], / V _ V}",
	vnull: true,
	c: 4,
	n: 0,
    },
    "υ": {
	m: "xɑhɑpɑxɑpɑxɑ",
	vz: true,
	c: 5,
	n: 8,
    },
    "η": {
	m: "hɑʔɑhɑʔɑhɑhɑʔɑʔɑ",
	vz: true,
	c: 6,
	n: 41,
    },
    "Ω": {
	m: "!ɑʔɑhɑpɑpɑhɑ!ɑ",
	vz: true,
	c: 7,
	n: 9,
    },
    "n": {
	a: "b",
	da: "p",
	m: "ɑbːɑtfɑt",
	dm: "ɑpːɑtfɑt",
	c: 1,
	n: 101,
    },
    "d": {
	a: "b",
	da: "p",
	m: "ɑbfɑtbɑt",
	c: 2,
	n: 40,
    },
    "t": {
	m: "fɑtbɑbːɑt",
	dm: "fɑtbɑpːɑt",
	c: 3,
	n: 53,
    },
    "g": {
	a: "b",
	da: "p",
	m: "ɑtbɑbfɑt",
	c: 4,
	n: 8,
    },
    "z": {
	a: "b",
	da: "p",
	m: "ɑtfɑtbɑ",
	z: "b",
	dz: "p",
	c: 5,
	n: 77,
    },
    "s": {
	m: "fɑtbɑtbɑ",
	z: "b",
	dz: "p",
	c: 7,
	n: 80,
    },
    "q": {
	m: "{2-hand clap}",
	vnull: true,
	c: 1,
	n: 12,
    },
    "l": {
	m: "{slap knee}",
	vnull: true,
	c: 3,
	n: 88,
    },
    "r": {
	m: "{slap both shoulders, each with opposite hand}",
	vnull: true,
	c: 4,
	n: 21,
    },
    "h": {
	m: "{2-hand double clap}",
	vnull: true,
	c: 5,
	n: -5,
    },
    "m": {
	m: "oj",
	va: true,
	vz: true,
	c: 7,
	n: -9,
    },
    "j": {
	a: "d",
	da: "t",
	m: "ɑlɑŋsɑk",
	dm: "ɑl̥ɑŋsɑk",
	c: 1,
	n: 17,
    },
    "k": {
	m: "sɑklɑŋdɑ",
	vz: true,
	c: 2,
	n: 23,
    },
    "p": {
	a: "d",
	da: "t",
	m: "ɑsɑklɑ",
	z: "ŋ",
	dz: "ŋ̊",
	c: 4,
	n: 10,
    },
    "Z": {
	m: "sɑkdɑlɑ",
	z: "ŋ",
	dz: "ŋ̊",
	c: 7,
	n: 49,
    }
    "b": {
	a: "b",
	da: "p",
	m: "ɑbːatbɑtsɑk",
	dm: "ɑpːatbɑtsɑk",
	c: 1,
	n: 34,
    },
    "c": {
	a: "b",
	da: "p",
	m: "ɑbːatsɑkbɑt",
	dm: "ɑpːatsɑkbɑt",
	c: 2,
	n: 113,
    },
    "x": {
	m: "sɑkbɑtbɑbːɑt",
	dm: "sɑkbɑtbɑpːɑt",
	c: 4,
	n: 11,
    },
    "f": {
	a: "b",
	da: "p",
	m: "ɑtsɑkbɑbːɑt",
	dm: "ɑtsɑkbɑpːɑt",
	c: 5,
	n: 76,
    },
    "v": {
	a: "b",
	da: "p",
	m: "ɑbsɑkbɑtbɑt",
	c: 6,
	n: 14,
    },
    "T": {
	m: "pn̩t.ø̃",
	vz: true,
	c: 1,
	n: -1,
    },
    "X": {
	a: "ŋ",
	da: "ŋ̊",
	m: "ə.ø̃",
	vz: true,
	c: 2,
	n: 4,
    },
    "Q": {
	m: "ojŋ.ø̃",
	dm: "ojŋ̊.ø̃",
	va: true,
	vz: true,
	c: 3,
	n: 5,
    },
    "J": {
	m: "slɹ̩.ø̃",
	vz: true,
	c: 5,
	n: -7,
    },
    "G": {
	m: "zdɑ.ø̃",
	vz: true,
	c: 6,
	n: 0,
    },
};

const object_prefix = {
    O1SG: {
	form: "ge1",
	p: "?",
	def: "1st person singular object",
    },
    O2SG: {
	form: "Gi12",
	p: "?",
	def: "2nd person singular object",
    },
    O3SG: {
	form: "blæ9",
	p: "N/S?",
	def: "3rd person singular object",
    },
    OXSG: {
	form: "rw6",
	p: "?",
	def: "singular non-object",
    },
    O1PL: {
	form: "mo4",
	p: "?",
	def: "1st person plural object",
    },
    O2PL: {
	form: "gι10",
	p: "?",
	def: "2nd person plural object",
    },
    O3PL: {
	form: "nu1",
	p: "W",
	def: "3rd person plural object",
    },
    OXPL: {
	form: "ge2",
	p: "?",
	def: "plural no object",
    },
    O1APL: {
	form: "bη1",
	p: "?",
	def: "1st person antiplural object",
    },
    O2APL: {
	form: "Qi7",
	p: "?",
	def: "2nd person antiplural object",
    },
    O3APL: {
	form: "qy2",
	p: "?",
	def: "3rd person antiplural object",
    },
    OXAPL: {
	form: "mo4",
	p: "N",
	def: "antiplural no object",
    },
};

const indirect_object_prefix = {
    I1SG: {
	form: "jι8",
	p: "?",
	def: "1st person singular indirect object",
    },
    I2SG: {
	form: "mη5",
	p: "?",
	def: "2nd person singular indirect object",
    },
    I3SG: {
	form: "lυ7",
	p: "?",
	def: "3rd person singular indirect object",
    },
    IXSG: {
	form: "ju2",
	p: "N",
	def: "singular non-indirect object",
    },
    I1PL: {
	form: "pe3",
	p: "?",
	def: "1st person plural indirect object",
    },
    I2PL: {
	form: "kw6",
	p: "?",
	def: "2nd person plural indirect object",
    },
    I3PL: {
	form: "pw12",
	p: "?",
	def: "3rd person plural indirect object",
    },
    IXPL: {
	form: "ju1",
	p: "N",
	def: "plural no indirect object",
    },
    I1APL: {
	form: "Xυ5",
	p: "?",
	def: "1st person antiplural indirect object",
    },
    I2APL: {
	form: "bε6",
	p: "?",
	def: "2nd person antiplural indirect object",
    },
    I3APL: {
	form: "du7",
	p: "?",
	def: "3rd person antiplural indirect object",
    },
    IXAPL: {
	form: "ju4",
	p: "N",
	def: "antiplural no indirect object",
    },
};

const mood_prefix = {
    SUB: {
	form: "",
	p: "S/∅?",
	def: "subjunctive",
    },
    JUNC: {
	form: "Xo16",
	p: "E",
	def: "junctive",
    },
    SUP: {
	form: "hw5",
	p: "S",
	def: "superjunctive",
    },
    INJ: {
	form: "To7",
	p: "?",
	def: "injunctive",
    },
    DISJ: {
	form: "ro6",
	p: "?",
	def: "disjunctive",
    },
};

const voice_prefix = {
    "SOI.POS": {
	form: "dε9",
	p: "S/∅",
    },
    "SOI.NEG": {
	form: "dε10",
	p: "S",
    },
    "SIO.POS": {
	form: "cΩ11",
	p: "?",
    },
    "SIO.NEG": {
	form: "Jη5",
	p: "?",
    },
    "OSI.POS": {
	form: "no13t",
	p: "S",
    },
    "OSI.NEG": {
	form: "tω15",
	p: "?",
    },
    "OIS.POS": {
	form: "lw10",
	p: "?",
    },
    "OIS.NEG": {
	form: "sw1",
	p: "?",
    },
    "ISO.POS": {
	form: "Ji7",
	p: "?",
    },
    "ISO.NEG": {
	form: "Gu1",
	p: "?",
    },
    "IOS.POS": {
	form: "ky8",
	p: "?",
    },
    "IOS.NEG": {
	form: "fe2",
	p: "?",
    },
};

const subject_suffix = {
    S1SG: {
	form: "ω5",
	p: "S",
	def: "1st person singular subject",
    },
    S2SG: {
	form: "e1",
	p: "?",
	def: "2nd person singular subject",
    },
    S3SG: {
	form: "o9",
	p: "N",
	def: "3rd person singular subject",
    },
    SXSG: {
	form: "υ4",
	p: "?",
	def: "singular non-subject",
    },
    S1PL: {
	form: "ε8",
	p: "?",
	def: "1st person plural subject",
    },
    S2PL: {
	form: "i1",
	p: "?",
	def: "2nd person plural subject",
    },
    S3PL: {
	form: "Ω16",
	p: "?",
	def: "3rd person plural subject",
    },
    SXPL: {
	form: "η3",
	p: "?",
	def: "plural no subject",
    },
    S1APL: {
	form: "nu8no7",
	p: "?",
	def: "1st person antiplural subject",
    },
    S2APL: {
	form: "w9",
	p: "?",
	def: "2nd person antiplural subject",
    },
    S3APL: {
	form: "y4",
	p: "N",
	def: "3rd person antiplural subject",
    },
    SXAPL: {
	form: "ω5",
	p: "?",
	def: "antiplural no subject",
    },
};

const verbs = {
    "Aghma.Shwa": {
	def: "be Angma Schwa as perceived by an annoyed internet commenter",
	form: "æ12ghmæ4shw12æ4",
    },
    "confused": {
	def: "be confused",
	form: "du16h",
    },
    "watch": {
	form: "glυ6g",
    },
    "gross.out": {
	def: "gross out",
	form: "jα6n",
	argumentative: true,
    },
    "speak": {
	form: "lη7",
    },
    "appealing": {
	def: "be appealing",
	form: "u2ck",
	mystical: true,
    },
    "film": {
	def: "film a video",
	form: "w4ri1te5",
	argumentative: true,
    },
};

const adverbs = {
    "first": {
	def: "first occurence; at the beginning",
	form: "si11x",
    },
    "continue": {
	form: "sTo4p",
    },
    "try": {
	def: "attempted",
	form: "zæ16m",
    },
    "mod.five": {
	def: "numerology agreement with a multiple of 5",
	form: "ω1m",
	mystical: true,
    },
};
