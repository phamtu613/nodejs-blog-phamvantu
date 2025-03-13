import { createHash } from 'crypto'
import { config } from 'dotenv'

config()

export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET)
}

export function convertToMarkdown(html: string) {
  return (
    html
      // Giữ nguyên iframe
      .replace(/<iframe[^>]*>(.*?)<\/iframe>/gs, (match) => `\n\n${match}\n\n`)
      // Chuyển đổi thẻ `<pre><code>` thành code block Markdown
      .replace(/<pre[^>]*?><code[^>]*class="language-([\w-]+)"[^>]*?>(.*?)<\/code><\/pre>/gs, (_, lang, code) => {
        const cleanedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        return `\n\`\`\`${lang}\n${cleanedCode.trim()}\n\`\`\`\n`
      })
      // Xử lý thẻ `<pre>` không có `<code>` bên trong
      .replace(/<pre[^>]*?>(.*?)<\/pre>/gs, (_, code) => {
        const cleanedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        return `\n\`\`\`\n${cleanedCode.trim()}\n\`\`\`\n`
      })
      // Chuyển đổi thẻ `<code>` nội dòng thành Markdown inline code
      .replace(/<code>(.*?)<\/code>/gs, (_, code) => `\`${code.trim()}\``)
      // Xử lý các thẻ `<strong>` thành `**text**` (in đậm)
      .replace(/<strong>(.*?)<\/strong>/gs, '**$1**')
      // Xử lý thẻ `<a>` thành [text](link)
      .replace(/<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/gs, '[$2]($1)')
      // Chuyển đổi thẻ heading `<h1>` đến `<h6>` sang Markdown
      .replace(/<h2>(.*?)<\/h2>/gs, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/gs, '### $1\n')
      .replace(/<h4>(.*?)<\/h4>/gs, '### $1\n')
      .replace(/<h5>(.*?)<\/h5>/gs, '### $1\n')
      .replace(/<h6>(.*?)<\/h6>/gs, '### $1\n')
      // Xóa các thẻ `<div>` bọc ngoài mà không ảnh hưởng đến nội dung bên trong
      .replace(/<\/?div[^>]*>/g, '')
      // Chuyển đổi `<p>` thành dòng mới
      .replace(/<\/?p>/g, '\n\n')
      // Chuyển đổi `<br>` thành xuống dòng
      .replace(/<br\s*\/?>/g, '\n')
      // Giữ nguyên `<iframe>` và xóa các thẻ HTML còn lại
      .replace(/<(?!iframe)([^>]+)>/g, '')
      // Chuẩn hóa khoảng trắng và dấu xuống dòng dư thừa
      .replace(/&nbsp;/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}
