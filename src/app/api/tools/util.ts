import { urlEncodePath } from "@/lib/utils";
var airtableApiUrl = `${process.env.AIRTABLE_API_URL}/${process.env.BASE_ID}/Tools`;

export async function getAllProductPaths(offset?: string) {
  var apiUrl = `${airtableApiUrl}?fields%5B%5D=Product%20Name`;
  if (offset) {
    apiUrl = `${apiUrl}&offset=${offset}`;
  }
  const res = await fetch(apiUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
  const { error } = await res;

  if (error) {
    console.log("error getting all the product paths for sitemap", error);
  }

  const records = await res.records;
  var productPaths = records.map(
    (record: any) =>
      record.id + "-" + urlEncodePath(record.fields["Product Name"])
  );
  if (await res.offset) {
    const { productPaths: productPaths2 } = await getAllProductPaths(
      res.offset
    );
    productPaths = productPaths.concat(productPaths2);
  }
  return { productPaths };
}
