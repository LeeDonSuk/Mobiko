const midiInput = document.getElementById("midiInput");
const previewBtn = document.getElementById("previewBtn");
const convertBtn = document.getElementById("convertBtn");
const output = document.getElementById("output");

let midiData = null;

midiInput.addEventListener("change", () => {
  const file = midiInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      MidiParser.parse(arrayBuffer, function (parsed) {
        midiData = parsed;
        output.textContent = `"${file.name}" 파일이 업로드되었습니다.`;
        previewBtn.disabled = false;
        convertBtn.disabled = false;
      });
    };
    reader.readAsArrayBuffer(file);
  } else {
    previewBtn.disabled = true;
    convertBtn.disabled = true;
    output.textContent = "MIDI 파일을 업로드해주세요.";
  }
});

convertBtn.addEventListener("click", () => {
  if (!midiData) {
    output.textContent = "먼저 MIDI 파일을 업로드해주세요.";
    return;
  }

  let mml = "";
  const noteMap = ["c", "c+", "d", "d+", "e", "f", "f+", "g", "g+", "a", "a+", "b"];

  midiData.track.forEach((track, t) => {
    mml += `// 트랙 ${t + 1}\n`;
    let currentOctave = 4;

    track.event.forEach((e) => {
      if (e.type === 9 && e.data && e.data[1] > 0) {
        const noteNumber = e.data[0];
        const pitch = noteNumber % 12;
        const octave = Math.floor(noteNumber / 12) - 1;

        const note = noteMap[pitch] || "c";
        if (octave !== currentOctave) {
          mml += `o${octave}`;
          currentOctave = octave;
        }
        mml += note + "4"; // 임시로 길이는 4분음표 고정
      }
    });
    mml += "\n\n";
  });

  output.textContent = mml || "MML 변환에 실패했습니다.";
});