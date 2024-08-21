from flask import Flask, request, jsonify
from transformers import AutoProcessor, AutoModelForCausalLM
from PIL import Image
import pytesseract
import io
import torch

app = Flask(__name__)

# Load Florence 2 model and processor
model_id = 'microsoft/Florence-2-large'
model = AutoModelForCausalLM.from_pretrained(model_id, trust_remote_code=True, torch_dtype='auto').eval().cuda()
processor = AutoProcessor.from_pretrained(model_id, trust_remote_code=True)

@app.route('/generate', methods=['POST'])
def generate():
    if 'image' in request.files:
        image_file = request.files['image']
        image = Image.open(io.BytesIO(image_file.read()))

        # Perform OCR on the image using Tesseract
        ocr_text = pytesseract.image_to_string(image)

        # Use the extracted text with Florence 2
        inputs = processor(text=ocr_text, return_tensors="pt").to("cuda")
        with torch.no_grad():
            outputs = model.generate(**inputs)
        generated_text = processor.decode(outputs[0], skip_special_tokens=True)

        return jsonify({'generated_text': generated_text})

    return jsonify({'error': 'No image uploaded'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
