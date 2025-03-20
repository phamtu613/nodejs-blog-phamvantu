import nodemailer from 'nodemailer'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config()

class EmailService {
  private transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT as string, 10),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS // generated ethereal password
      }
    })
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      console.log(`📩 Sending email to: ${to}`)

      const info = await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        html // html body
      })

      console.log(`✅ Message sent: ${info.messageId}`)
      if (nodemailer.getTestMessageUrl(info)) {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
      }

      return info
    } catch (error) {
      console.error('❌ Error sending email:', error)
      throw new Error('Failed to send email')
    }
  }

  async sendTemplateMail(to: string, subject: string, templateName: string, variables: Record<string, any>) {
    const templatePath = path.resolve(__dirname, '..', 'templates', `${templateName}.html`)
    let template = fs.readFileSync(templatePath, 'utf8')

    // Replace variables in the template
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g')
      template = template.replace(regex, value)
    }

    return this.sendMail(to, subject, template)
  }
}

const emailService = new EmailService()
export default emailService
