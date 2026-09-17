 import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import PDFDocument from "pdfkit";

export const pdfDownload = asyncHandler(async (req, res) => {
    const { result } = req.body;

    if (!result?.data) {
        throw new ApiError(400, "No content provided");
    }

    const { data } = result;

    const doc = new PDFDocument({
        margin: 50,
        size: "A4"
    });

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="ExamNotesAI.pdf"'
    );

    doc.on("error", (error) => {
        console.error("PDF DOCUMENT ERROR:", error);

        if (!res.headersSent) {
            res.status(500).end();
        } else {
            res.destroy(error);
        }
    });

    res.on("error", (error) => {
        console.error("RESPONSE ERROR:", error);
    });

    doc.pipe(res);

    doc.fontSize(22)
        .font("Helvetica-Bold")
        .text("ExamNotes AI", {
            align: "center"
        });

    doc.moveDown();

    doc.fontSize(14)
        .font("Helvetica-Bold")
        .text("Importance");

    doc.fontSize(12)
        .font("Helvetica")
        .text(data.importance || "Not specified");

    doc.moveDown();

    doc.fontSize(16)
        .font("Helvetica-Bold")
        .text("Sub Topics");

    doc.moveDown(0.5);

    if (data.subTopics) {
        Object.entries(data.subTopics).forEach(([star, topics]) => {
            doc.fontSize(13)
                .font("Helvetica-Bold")
                .text(`${star} Topics`);

            if (Array.isArray(topics)) {
                topics.forEach((topic) => {
                    doc.fontSize(11)
                        .font("Helvetica")
                        .text(`• ${topic}`);
                });
            }

            doc.moveDown(0.5);
        });
    }

    doc.moveDown();

    doc.fontSize(16)
        .font("Helvetica-Bold")
        .text("Notes");

    doc.moveDown(0.5);

    const cleanNotes = String(data.notes || "")
        .replace(/#{1,6}\s?/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "");

    doc.fontSize(11)
        .font("Helvetica")
        .text(cleanNotes, {
            lineGap: 4
        });

    doc.moveDown();

    doc.fontSize(16)
        .font("Helvetica-Bold")
        .text("Revision Points");

    doc.moveDown(0.5);

    if (Array.isArray(data.revisonPoints)) {
        data.revisonPoints.forEach((point) => {
            doc.fontSize(11)
                .font("Helvetica")
                .text(`• ${point}`, {
                    lineGap: 3
                });
        });
    }

    doc.moveDown();

    doc.fontSize(16)
        .font("Helvetica-Bold")
        .text("Important Questions");

    doc.moveDown(0.5);

    doc.fontSize(13)
        .font("Helvetica-Bold")
        .text("Short Questions");

    doc.moveDown(0.3);

    if (Array.isArray(data.questions?.short)) {
        data.questions.short.forEach((question) => {
            doc.fontSize(11)
                .font("Helvetica")
                .text(`• ${question}`, {
                    lineGap: 3
                });
        });
    }

    doc.moveDown(0.7);

    doc.fontSize(13)
        .font("Helvetica-Bold")
        .text("Long Questions");

    doc.moveDown(0.3);

    if (Array.isArray(data.questions?.long)) {
        data.questions.long.forEach((question) => {
            doc.fontSize(11)
                .font("Helvetica")
                .text(`• ${question}`, {
                    lineGap: 3
                });
        });
    }

    doc.moveDown(0.7);

    doc.fontSize(13)
        .font("Helvetica-Bold")
        .text("Diagram Questions");

    doc.moveDown(0.3);

    const diagramQuestions = data.questions?.diagrams;

    if (Array.isArray(diagramQuestions)) {
        diagramQuestions.forEach((question) => {
            doc.fontSize(11)
                .font("Helvetica")
                .text(`• ${question}`);
        });
    } else {
        doc.fontSize(11)
            .font("Helvetica")
            .text(diagramQuestions || "No diagram questions");
    }

    doc.end();
});