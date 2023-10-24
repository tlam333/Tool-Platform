import { NextResponse } from "next/server";
const apiURL = process.env.AIRTABLE_API_URL;

export async function GET() {
  var url = `${apiURL}/${process.env.BASE_ID}/FAQ?pageSize=100&sort[0][field]=ID&sort[0][direction]=asc`;

  url = encodeURI(url);

  const fieldList = ["ID", "Question", "Answer", "Type"];

  fieldList.forEach((field) => {
    url = url + `&fields%5B%5D=${field}`; //&fields[]=field;
  });

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const records = await res.records;

  const error = await res.error;

  const faq = await records.map((record: any) => ({
    id: record.fields["ID"],
    question: record.fields["Question"],
    answer: record.fields["Answer"],
    type: record.fields["Type"],
  }));

  return NextResponse.json({
    faq,
    total: faq.length,
  });
}
