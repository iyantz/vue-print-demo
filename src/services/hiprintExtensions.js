import { hiprint } from 'vue-plugin-hiprint'
import { codeService } from './codeService'

/**
 * 注册条形码打印元素
 */
export function registerBarcodeElement() {
    // 注册条形码打印元素
    hiprint.PrintElementTypeManager.addElementTypes('barcode', {
        title: '条形码',
        type: 'barcode',
        defaultOptions: {
            left: 0,
            top: 0,
            height: 50,
            width: 160,
            field: 'barcode',
            fontSize: 12,
            fontWeight: 'normal',
            textAlign: 'center',
            color: '#000',
            backgroundColor: '#fff',
            barcodeFormat: 'CODE128',
            showText: true,
            borderWidth: 0,
            borderColor: '#000',
            borderStyle: 'solid'
        },
        // 打印时的处理函数
        onPreview: async function (element, data) {
            const options = element.options
            const barcodeText = data[options.field] || options.title || 'DEFAULT'

            try {
                // 生成条形码
                const barcodeDataUrl = await codeService.generateBarcode(barcodeText, {
                    format: options.barcodeFormat,
                    width: 2,
                    height: options.height - 10,
                    displayValue: options.showText,
                    fontSize: options.fontSize,
                    textAlign: options.textAlign,
                    background: options.backgroundColor,
                    lineColor: options.color
                })

                // 创建图片元素
                const img = document.createElement('img')
                img.src = barcodeDataUrl
                img.style.width = options.width + 'px'
                img.style.height = options.height + 'px'
                img.style.objectFit = 'contain'

                return img
            } catch (error) {
                console.error('条形码生成失败:', error)
                // 返回错误提示
                const errorDiv = document.createElement('div')
                errorDiv.textContent = '条形码生成失败'
                errorDiv.style.width = options.width + 'px'
                errorDiv.style.height = options.height + 'px'
                errorDiv.style.border = '1px solid red'
                errorDiv.style.color = 'red'
                errorDiv.style.textAlign = 'center'
                errorDiv.style.lineHeight = options.height + 'px'
                return errorDiv
            }
        }
    })
}

/**
 * 注册二维码打印元素
 */
export function registerQRCodeElement() {
    // 注册二维码打印元素
    hiprint.PrintElementTypeManager.addElementTypes('qrcode', {
        title: '二维码',
        type: 'qrcode',
        defaultOptions: {
            left: 0,
            top: 0,
            height: 80,
            width: 80,
            field: 'qrcode',
            backgroundColor: '#fff',
            color: '#000',
            errorLevel: 'M',
            margin: 4,
            borderWidth: 0,
            borderColor: '#000',
            borderStyle: 'solid'
        },
        // 打印时的处理函数
        onPreview: async function (element, data) {
            const options = element.options
            const qrcodeText = data[options.field] || options.title || 'DEFAULT'

            try {
                // 生成二维码
                const qrcodeDataUrl = await codeService.generateQRCode(qrcodeText, {
                    width: Math.min(options.width, options.height),
                    errorCorrectionLevel: options.errorLevel,
                    margin: options.margin,
                    color: {
                        dark: options.color,
                        light: options.backgroundColor
                    }
                })

                // 创建图片元素
                const img = document.createElement('img')
                img.src = qrcodeDataUrl
                img.style.width = options.width + 'px'
                img.style.height = options.height + 'px'
                img.style.objectFit = 'contain'

                return img
            } catch (error) {
                console.error('二维码生成失败:', error)
                // 返回错误提示
                const errorDiv = document.createElement('div')
                errorDiv.textContent = '二维码生成失败'
                errorDiv.style.width = options.width + 'px'
                errorDiv.style.height = options.height + 'px'
                errorDiv.style.border = '1px solid red'
                errorDiv.style.color = 'red'
                errorDiv.style.textAlign = 'center'
                errorDiv.style.lineHeight = options.height + 'px'
                return errorDiv
            }
        }
    })
}

/**
 * 初始化所有扩展
 */
export function initHiprintExtensions() {
    try {
        registerBarcodeElement()
        registerQRCodeElement()
        console.log('Hiprint 扩展初始化成功')
    } catch (error) {
        console.error('Hiprint 扩展初始化失败:', error)
    }
}

/**
 * 创建条形码图片打印元素（替代方案）
 */
export function createBarcodeImageElement(options) {
    return {
        options: {
            left: options.left || 20,
            top: options.top || 290,
            height: options.height || 50,
            width: options.width || 160,
            field: options.field || 'barcodeImage',
            title: '条形码',
            fit: 'contain'
        },
        printElementType: {
            title: '条形码图片',
            type: 'image'
        }
    }
}

/**
 * 创建二维码图片打印元素（替代方案）
 */
export function createQRCodeImageElement(options) {
    return {
        options: {
            left: options.left || 20,
            top: options.top || 360,
            height: options.height || 80,
            width: options.width || 80,
            field: options.field || 'qrcodeImage',
            title: '二维码',
            fit: 'contain'
        },
        printElementType: {
            title: '二维码图片',
            type: 'image'
        }
    }
}

export default {
    initHiprintExtensions,
    registerBarcodeElement,
    registerQRCodeElement,
    createBarcodeImageElement,
    createQRCodeImageElement
} 