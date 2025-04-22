import init, { convert_midi_to_mml } from "./mml_converter.js";

async function loadWasm() {
  await init();

  const previewBtn = document.getElementById("previewBtn");
  const convertBtn = document.getElementById("convertBtn");
  const midiInput = document.getElementById("midiInput");
  const output = document.getElementById("output");

  midiInput.addEventListener("change", () => {
    if (midiInput.files.length > 0) {
      previewBtn.disabled = false;
      convertBtn.disabled = false;

      const file = midiInput.files[0];
      output.textContent = `"${file.name}" 파일이 업로드되었습니다.`;
    } else {
      previewBtn.disabled = true;
      convertBtn.disabled = true;
    }
  });

  convertBtn.addEventListener("click", async () => {
    const file = midiInput.files[0];
    if (!file) {
      output.textContent = "MIDI 파일을 먼저 선택하세요.";
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Data = new Uint8Array(arrayBuffer);

    // 실제 변환 로직 호출 (지금은 더미)
    const mmlResult = convert_midi_to_mml("dummy midi data");
    output.textContent = mmlResult;
  });
}

loadWasm();
