import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomOrder, AIChatMessage, MessageRole } from '../types';
import Modal from '../components/Modal'; // Modal component is already imported, ensure it's correct
import AIChatbot from '../components/AIChatbot';
import MeasurementInput from '../components/MeasurementInput'; // Import new component
import ImageUploadWithCamera from '../components/ImageUploadWithCamera'; // Import new component
import { GARMENT_TYPES, FABRIC_OPTIONS, COLOR_OPTIONS } from '../constants';
import { getGeminiMultiModalImageResponse } from '../services/geminiService';


interface CustomOrderPageProps {
  initialGarmentId?: string;
  onOpenModal: (title: string, content: React.ReactNode) => void;
  onCloseModal: () => void;
}

const CustomOrderPage: React.FC<CustomOrderPageProps> = ({ onOpenModal, onCloseModal }) => {
  const navigate = useNavigate();
  const [garmentType, setGarmentType] = useState<string>('');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [chest, setChest] = useState<number | ''>('');
  const [waist, setWaist] = useState<number | ''>('');
  const [fabric, setFabric] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [referenceImageBase64, setReferenceImageBase64] = useState<string | undefined>(undefined); // Custom Order Reference Image
  const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([]);

  // States for Virtual Try-On Assistant
  const [userBodyImageBase64, setUserBodyImageBase64] = useState<string | undefined>(undefined);
  const [outfitSampleImageBase64, setOutfitSampleImageBase64] = useState<string | undefined>(undefined);
  const [tryOnFeedback, setTryOnFeedback] = useState<string | null>(null);
  const [isTryOnLoading, setIsTryOnLoading] = useState<boolean>(false);


  // Removed initialGarmentId prop and used `useLocation` instead
  // This allows the component to be standalone and not tied to App.tsx's state for initial garment.
  // The logic for setting initial garment is now handled through URL parameters if needed.
  useEffect(() => {
    // Save last page to local storage
    localStorage.setItem('hofm_last_page', 'custom-order');
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const garmentIdParam = params.get('garmentId');
    if (garmentIdParam) {
      setGarmentType(garmentIdParam);
    }
  }, []);

  const collectOrderData = useCallback((validate: boolean = false): CustomOrder | null => {
    if (validate && (!garmentType || !height || !chest || !waist || !fabric || !color || !customerEmail)) {
      alert('Please complete required fields: garment, height, chest, waist, fabric, color, and email.');
      return null;
    }

    const obj: CustomOrder = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      garment: garmentType,
      height: Number(height),
      weight: weight === '' ? null : Number(weight),
      chest: Number(chest),
      waist: Number(waist),
      fabric,
      color,
      notes,
      email: customerEmail,
      referenceImageBase64: referenceImageBase64, // Include reference image
      created: new Date().toISOString(),
    };
    return obj;
  }, [garmentType, height, weight, chest, waist, fabric, color, notes, customerEmail, referenceImageBase64]);

  const saveOrder = useCallback((orderObj: CustomOrder) => {
    const key = 'hofm_orders_v1';
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    current.unshift(orderObj);
    localStorage.setItem(key, JSON.stringify(current));
    localStorage.setItem('hofm_last_order', JSON.stringify(orderObj));
  }, []);

  const handleCustomOrderImageUpload = useCallback((fileBase64: string | undefined) => {
    setReferenceImageBase64(fileBase64);
  }, []);

  const resetFormFields = useCallback(() => {
    setGarmentType('');
    setHeight('');
    setWeight('');
    setChest('');
    setWaist('');
    setFabric('');
    setColor('');
    setNotes('');
    setCustomerEmail('');
    setReferenceImageBase64(undefined); // Clear custom order reference image
    setUserBodyImageBase64(undefined); // Clear try-on images
    setOutfitSampleImageBase64(undefined);
    setTryOnFeedback(null); // Clear try-on feedback
    setChatHistory([]); // Clear chat history
  }, []);

  const handlePreview = useCallback(() => {
    const summary = collectOrderData(true);
    if (!summary) return;

    onOpenModal(
      'Order Preview',
      <div>
        <div className="space-y-3 text-sm text-[var(--brand-dark)]">
          <div><strong>Garment:</strong> {summary.garment}</div>
          <div><strong>Height:</strong> {summary.height} cm</div>
          <div><strong>Weight:</strong> {summary.weight || '-'} kg</div>
          <div><strong>Chest:</strong> {summary.chest} cm</div>
          <div><strong>Waist:</strong> {summary.waist} cm</div>
          <div><strong>Fabric:</strong> {summary.fabric}</div>
          <div><strong>Color:</strong> {summary.color}</div>
          <div><strong>Notes:</strong> {summary.notes || '-'}</div>
          <div><strong>Email:</strong> {summary.email}</div>
          {summary.referenceImageBase64 && (
            <div>
              <strong>Reference Image:</strong>
              <img src={summary.referenceImageBase64} alt="Reference" className="mt-2 max-w-full h-auto rounded-lg shadow" style={{ maxHeight: '150px' }} />
            </div>
          )}
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              saveOrder(summary);
              onCloseModal();
              alert(`Order saved locally. Our team will contact you at ${summary.email} to confirm and provide a quote.`);
              resetFormFields();
            }}
            className="px-4 py-2 bg-[var(--brand-dark)] text-white rounded hover:opacity-95 transition"
          >
            Confirm & Save
          </button>
          <button
            type="button" // Ensure it's type="button" to prevent form submission
            onClick={onCloseModal}
            className="px-4 py-2 border border-gray-300 rounded text-[var(--brand-dark)] hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }, [collectOrderData, onOpenModal, onCloseModal, saveOrder, resetFormFields]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const summary = collectOrderData(true);
    if (!summary) return;
    saveOrder(summary);
    alert(`Thank you — your custom order has been submitted. We will contact you at ${summary.email} within 24 hours.`);
    resetFormFields();
    navigate('/'); // Optionally redirect to home or a confirmation page
  }, [collectOrderData, saveOrder, navigate, resetFormFields]);

  const handleNewChatMessage = useCallback((message: AIChatMessage) => {
    console.log("New AI Chat Message:", message);
  }, []);

  const handleGetFitFeedback = useCallback(async () => {
    if (!userBodyImageBase64 || !outfitSampleImageBase64) {
      alert('Please upload both your body photo and an outfit sample photo to get fit feedback.');
      return;
    }

    setIsTryOnLoading(true);
    setTryOnFeedback(null); // Clear previous feedback

    try {
      const prompt = `Given the user's body in the first image and the outfit in the second image, please provide detailed feedback on how well the outfit might fit. Consider factors like body shape, garment style, and potential alterations. Focus on aspects like sleeve length, overall length, tightness/looseness, and how the garment drapes on the user's form. Suggest improvements for a custom fit.`;

      const response = await getGeminiMultiModalImageResponse(
        prompt,
        userBodyImageBase64,
        outfitSampleImageBase64
      );
      setTryOnFeedback(response.text);
    } catch (error: any) {
      console.error('Error getting fit feedback from AI:', error);
      setTryOnFeedback(`Failed to get feedback: ${error.message || 'An unknown error occurred.'}`);
    } finally {
      setIsTryOnLoading(false);
    }
  }, [userBodyImageBase64, outfitSampleImageBase64]);


  const aiSystemInstruction = `You are an AI assistant for House of Miraal, a custom wear tailoring service. Your goal is to help customers make informed choices about their custom garment orders. The available garment types are: ${Object.values(GARMENT_TYPES).flat().map(g => g.label).join(', ')}. Available fabrics are: ${FABRIC_OPTIONS.join(', ')}. Available colors are: ${COLOR_OPTIONS.join(', ')}. Based on the current form inputs (Garment Type: ${garmentType || 'Not selected'}, Fabric: ${fabric || 'Not selected'}, Color: ${color || 'Not selected'}, Notes: ${notes || 'No notes'}, ${referenceImageBase64 ? 'Reference image provided.' : ''}), provide suggestions on fabrics, colors, or styling. If a reference image is provided, ask the user to describe what they like about it, as you cannot "see" images in this chat context. Be helpful, polite, and guide them through the customization process. Do not create external links or offer services outside tailoring.`;

  const initialAIChatMessage = useMemo(() => {
    let message = "Hello! I'm your House of Miraal custom order assistant. How can I help you customize your perfect garment today?";
    if (garmentType && referenceImageBase64) {
      message = `Welcome! You've selected a ${garmentType} and provided a reference image. What specific elements or styles from the image do you love, and how can I assist with fabric and color recommendations?`;
    } else if (garmentType) {
      message = `Great choice with the ${garmentType}! I can offer suggestions on fabrics and colors that would complement this style. What are you looking for?`;
    } else if (referenceImageBase64) {
      message = `Hello! You've uploaded a reference image. Could you tell me what aspects or details of this image you'd like to incorporate into your custom garment? I can help with fabric and color recommendations.`;
    }
    return message;
  }, [garmentType, referenceImageBase64]);


  return (
    <section id="page-custom-order" className="page-content py-12 animate-fade-in">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-black text-[var(--brand-dark)] mb-6">Custom Order</h1>

          <div className="bg-white rounded-xl shadow p-8">
            <form id="custom-order-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="garment-type" className="block text-sm font-semibold mb-2 text-[var(--brand-dark)]">Garment Type</label>
                <select
                  id="garment-type"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                  value={garmentType}
                  onChange={(e) => setGarmentType(e.target.value)}
                  required
                >
                  <option value="">Choose garment...</option>
                  <optgroup label="Men's">
                    {GARMENT_TYPES.MEN.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </optgroup>
                  <optgroup label="Women's">
                    {GARMENT_TYPES.WOMEN.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </optgroup>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <MeasurementInput
                  id="inp-height"
                  label="Height"
                  value={height}
                  onChange={setHeight}
                  placeholder="170"
                  unit="cm"
                  required
                  description="Measure from the top of your head to the floor, without shoes, standing straight."
                  onOpenModal={onOpenModal}
                  onCloseModal={onCloseModal}
                />
                <MeasurementInput
                  id="inp-weight"
                  label="Weight"
                  value={weight}
                  onChange={setWeight}
                  placeholder="70"
                  unit="kg"
                  description="Your current body weight in kilograms. This is an optional measurement and helps us understand body proportions for a better fit."
                  onOpenModal={onOpenModal}
                  onCloseModal={onCloseModal}
                />
                <MeasurementInput
                  id="inp-chest"
                  label="Chest / Bust"
                  value={chest}
                  onChange={setChest}
                  placeholder="95"
                  unit="cm"
                  required
                  description="Measure around the fullest part of your chest/bust, keeping the tape parallel to the floor and your arms relaxed."
                  onOpenModal={onOpenModal}
                  onCloseModal={onCloseModal}
                />
                <MeasurementInput
                  id="inp-waist"
                  label="Waist"
                  value={waist}
                  onChange={setWaist}
                  placeholder="80"
                  unit="cm"
                  required
                  description="Measure around your natural waistline, usually above the navel. Keep the tape snug but not tight."
                  onOpenModal={onOpenModal}
                  onCloseModal={onCloseModal}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inp-fabric" className="block text-sm font-semibold mb-2 text-[var(--brand-dark)]">Fabric</label>
                  <select
                    id="inp-fabric"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    required
                  >
                    <option value="">Choose fabric...</option>
                    {FABRIC_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="inp-color" className="block text-sm font-semibold mb-2 text-[var(--brand-dark)]">Color</label>
                  <select
                    id="inp-color"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  >
                    <option value="">Choose color...</option>
                    {COLOR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="customer-email" className="block text-sm font-semibold mb-2 text-[var(--brand-dark)]">Email Address</label>
                <input
                  id="customer-email"
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                  placeholder="your.email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <ImageUploadWithCamera
                  id="reference-image-custom-order"
                  label="Upload Reference Image (Optional, max 2MB)"
                  currentImageBase64={referenceImageBase64}
                  onImageChange={handleCustomOrderImageUpload}
                  showCameraOption={false} // No camera for general reference
                />
              </div>

              <div>
                <label htmlFor="inp-notes" className="block text-sm font-semibold mb-2 text-[var(--brand-dark)]">Additional Details</label>
                <textarea
                  id="inp-notes"
                  className="w-full p-3 border border-gray-300 rounded h-28 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                  placeholder="Any special requests or embroidery notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" className="bg-[var(--brand-dark)] text-white px-6 py-3 rounded hover:opacity-95 transition">
                  Submit Order
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="px-4 py-3 border border-gray-300 rounded text-sm text-[var(--brand-dark)] hover:bg-gray-50 transition"
                >
                  Preview Summary
                </button>
              </div>
            </form>
          </div>

          {/* Virtual Try-On Assistant Section */}
          <div className="mt-8 bg-white rounded-xl shadow p-8 space-y-6">
            <h2 className="text-2xl font-black text-[var(--brand-dark)] mb-4">Virtual Try-On Assistant</h2>
            <p className="text-gray-700 text-sm">Upload a photo of yourself and an outfit sample to get AI-powered feedback on how it might fit.</p>

            <div className="grid md:grid-cols-2 gap-6">
              <ImageUploadWithCamera
                id="user-body-image"
                label="Your Body Photo (max 2MB)"
                currentImageBase64={userBodyImageBase64}
                onImageChange={setUserBodyImageBase64}
                showCameraOption={true}
              />
              <ImageUploadWithCamera
                id="outfit-sample-image"
                label="Outfit Sample Photo (max 2MB)"
                currentImageBase64={outfitSampleImageBase64}
                onImageChange={setOutfitSampleImageBase64}
                showCameraOption={false}
              />
            </div>

            <button
              type="button"
              onClick={handleGetFitFeedback}
              className={`w-full bg-[var(--brand-accent)] text-white px-6 py-3 rounded hover:opacity-95 transition flex items-center justify-center gap-2
                ${(!userBodyImageBase64 || !outfitSampleImageBase64 || isTryOnLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!userBodyImageBase64 || !outfitSampleImageBase64 || isTryOnLoading}
            >
              {isTryOnLoading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isTryOnLoading ? 'Getting Feedback...' : 'Get Fit Feedback'}
            </button>

            {tryOnFeedback && (
              <div className="mt-4 p-4 bg-[var(--bg)] rounded border border-gray-200 text-sm text-[var(--brand-dark)]">
                <h3 className="font-semibold mb-2">AI Fit Feedback:</h3>
                <p>{tryOnFeedback}</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-[70vh] flex flex-col">
          <h2 className="text-2xl font-black text-[var(--brand-dark)] mb-4">Custom Order Assistant</h2>
          <p className="text-gray-700 mb-4 text-sm">Have questions about fabrics, colors, or styles? Our AI assistant can help!</p>
          <AIChatbot
            systemInstruction={aiSystemInstruction}
            initialMessage={initialAIChatMessage}
            onNewMessage={handleNewChatMessage}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        </div>
      </div>
    </section>
  );
};

export default CustomOrderPage;