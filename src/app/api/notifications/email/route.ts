import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

/**
 * parameters -
 * email
 * name
 * dynamicTemplateData
 * templateId
 */
export async function sendEmail(
  email: string,
  name: string,
  dynamicTemplateData: Object,
  templateId: string
) {
  const msg = {
    to: [
      {
        email: email,
        name: name,
      },
    ],
    from: { email: "will@nearbytools.com.au", name: "Will @ Nearby Tools" },
    templateId,
    dynamic_template_data: dynamicTemplateData,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
  return true;
}
