const createEmail = (name: string) => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Email Template</title>
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            width: 100%;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border-collapse: collapse;
        }
        .header, .footer {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            text-align: center;
        }
        .content {
            margin: 20px 0;
            color: #333333;
        }
    </style>
</head>
<body>
    <table class="container">
        <tr>
            <td class="header">
                <h2>Welcome to Agencybox</h2>
            </td>
        </tr>
        <tr>
            <td class="content">
                <p>Dear ${name},</p>
                <p>Thank you for reaching out to us. We have received your email and would like to acknowledge that we have successfully received it.</p>
                <p>We appreciate your interest and we will do our best to respond to your inquiry as soon as possible.</p>
                <p>If you require any further information in the meantime, please do not hesitate to contact us. We are always here to help.</p>
                <p>Thank you for your patience and we look forward to connecting with you soon.</p>
                <p>Best regards,</p>
                <p>Agencybox</p>
            </td>
        </tr>
        <tr>
            <td class="footer">
                &copy; [Year] Agencybox, All rights reserved.
            </td>
        </tr>
    </table>
</body>
</html> `;
};

export default createEmail;
