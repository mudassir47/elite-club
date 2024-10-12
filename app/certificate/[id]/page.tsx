"use client";
import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useParams } from "next/navigation";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const CertificatePage = () => {
  const { id } = useParams();
  const [certificateData, setCertificateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const authCodePosition = { x: 230, y: 497 }; // Adjust as needed

  useEffect(() => {
    const fetchCertificateData = async () => {
      if (id) {
        const db = getDatabase();
        const certificateRef = ref(db, `certificates/${id}`);
        const snapshot = await get(certificateRef);

        if (snapshot.exists()) {
          setCertificateData(snapshot.val());
        } else {
          setError("Certificate not found.");
        }
      } else {
        setError("Invalid auth code.");
      }
      setLoading(false);
    };

    fetchCertificateData();
  }, [id]);

  useEffect(() => {
    if (certificateData) {
      const downloadPDF = async () => {
        const existingPdfBytes = await fetch('/certificate.pdf').then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPage(0);

        const { width, height } = page.getSize();
        const nameFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontSize = 40;
        const textWidth = nameFont.widthOfTextAtSize(certificateData.name, fontSize);
        const centeredX = (width - textWidth) / 2;

        page.drawText(certificateData.name, {
          x: centeredX,
          y: height - 345,
          size: fontSize,
          color: rgb(0, 0, 0),
          font: nameFont,
        });

        page.drawText(certificateData.authCode, {
          x: authCodePosition.x,
          y: height - authCodePosition.y,
          size: 16,
          color: rgb(0, 0, 0),
          font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      };

      downloadPDF();
    }
  }, [certificateData]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">Certificate Details</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-center">Certificate Preview</h2>
        {pdfUrl && (
          <div className="flex justify-center">
            <iframe 
              src={pdfUrl} 
              width="100%" 
              height="600px" 
              title="PDF Preview" 
              className="border border-gray-300 rounded-lg my-4"
              style={{ maxWidth: '700px', aspectRatio: '1.5/1' }}
            ></iframe>
          </div>
        )}
      </div>

      {pdfUrl && (
        <div className="text-center">
          <a 
            href={pdfUrl} 
            download 
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Download Certificate
          </a>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold">Certificate Information</h2>
        <p className="mt-2"><strong>Name:</strong> {certificateData.name}</p>
        <p className="mt-2"><strong>Auth Code:</strong> {certificateData.authCode}</p>
        <p className="mt-2"><strong>Number:</strong> {certificateData.number}</p>
      </div>

    </div>
  );
};

export default CertificatePage;
