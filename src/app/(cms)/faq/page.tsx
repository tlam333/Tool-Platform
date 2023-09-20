import { getAllFaq } from "@/lib/services/cms.services";
import Script from "next/script";

export const metadata = {
  title: "Help and support - Nearby Tools",
  description:
    "Find answers to your questions about Nearby Tools. Feel free to contact us if you can't find what you're looking for.",
};

export default async function Faq() {
  var rederFaq = "";
  var faqLD = "";
  await getAllFaq()
    .then(({ faq }) => {
      rederFaq = faq.map((item: FAQ) => (
        <div className="collapse collapse-plus bg-base-200 mt-5" key={item.id}>
          <input
            type="radio"
            name="my-accordion-3"
            defaultChecked={item.id == "1"}
            key={item.id + "input"}
          />
          <div
            className="collapse-title text-xl font-medium"
            key={item.id + "question"}
          >
            <h2 className="py-2">{item.question}</h2>
          </div>
          <div className="collapse-content" key={item.id + "answer"}>
            <p className="py-2">{item.answer}</p>
          </div>
        </div>
      ));
      faqLD = faq.map(
        (item: FAQ) =>
          `{
        "@type": "Question",
        "name": "${item.question?.replace(/[\n\r]/g, " ")}",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "<p>${item.answer?.replace(/[\n\r]/g, " ")}</p>"
        }
    }`
      );
    })
    .catch((err) => console.error(err));

  const faqJsonLd = {
    __html: `{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [${faqLD}]
    }`,
  };

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={faqJsonLd}
        id="faq-jsonld"
      />
      <div className="px-2 md:px-2 lg:px-10 xl:px-20 w-full min-h-screen">
        <div className="mx-auto max-w-5xl py-10">
          <h1 className="py-5">Frequently Asked Questions</h1>
          {rederFaq}
        </div>
      </div>
    </>
  );
}
