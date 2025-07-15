import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'

/**
 * 条形码和二维码生成服务
 */
class CodeService {
    constructor() {
        this.barcodeOptions = {
            format: 'CODE128',
            width: 2,
            height: 100,
            displayValue: true,
            fontSize: 16,
            textMargin: 2,
            fontOptions: '',
            font: 'monospace',
            textAlign: 'center',
            textPosition: 'bottom',
            background: '#ffffff',
            lineColor: '#000000',
            margin: 10,
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10
        }

        this.qrcodeOptions = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            width: 200
        }
    }

    /**
     * 生成条形码
     * @param {string} text 条形码内容
     * @param {Object} options 可选配置
     * @returns {Promise<string>} 返回base64格式的条形码图片
     */
    async generateBarcode(text, options = {}) {
        try {
            const canvas = document.createElement('canvas')
            const finalOptions = { ...this.barcodeOptions, ...options }

            JsBarcode(canvas, text, finalOptions)

            return canvas.toDataURL('image/png')
        } catch (error) {
            console.error('生成条形码失败:', error)
            throw new Error('生成条形码失败: ' + error.message)
        }
    }

    /**
     * 生成二维码
     * @param {string} text 二维码内容
     * @param {Object} options 可选配置
     * @returns {Promise<string>} 返回base64格式的二维码图片
     */
    async generateQRCode(text, options = {}) {
        try {
            const finalOptions = { ...this.qrcodeOptions, ...options }
            const qrCodeDataURL = await QRCode.toDataURL(text, finalOptions)
            return qrCodeDataURL
        } catch (error) {
            console.error('生成二维码失败:', error)
            throw new Error('生成二维码失败: ' + error.message)
        }
    }

    /**
     * 获取支持的条形码格式
     * @returns {Array} 支持的条形码格式列表
     */
    getSupportedBarcodeFormats() {
        return [
            { label: 'CODE128', value: 'CODE128' },
            { label: 'CODE39', value: 'CODE39' },
            { label: 'EAN13', value: 'EAN13' },
            { label: 'EAN8', value: 'EAN8' },
            { label: 'UPC', value: 'UPC' },
            { label: 'ITF14', value: 'ITF14' },
            { label: 'MSI', value: 'MSI' },
            { label: 'pharmacode', value: 'pharmacode' },
            { label: 'codabar', value: 'codabar' }
        ]
    }

    /**
     * 获取二维码纠错等级选项
     * @returns {Array} 纠错等级选项
     */
    getQRCodeErrorLevels() {
        return [
            { label: 'L (低)', value: 'L' },
            { label: 'M (中)', value: 'M' },
            { label: 'Q (高)', value: 'Q' },
            { label: 'H (最高)', value: 'H' }
        ]
    }

    /**
     * 验证条形码内容
     * @param {string} text 条形码内容
     * @param {string} format 条形码格式
     * @returns {boolean} 是否有效
     */
    validateBarcodeContent(text, format) {
        if (!text || text.length === 0) {
            return false
        }

        switch (format) {
            case 'EAN13':
                return /^\d{13}$/.test(text)
            case 'EAN8':
                return /^\d{8}$/.test(text)
            case 'UPC':
                return /^\d{12}$/.test(text)
            case 'CODE39':
                return /^[0-9A-Z\-. $/+%]*$/.test(text)
            case 'CODE128':
            default:
                return true // CODE128 支持所有ASCII字符
        }
    }

    /**
     * 创建条形码打印元素配置
     * @param {Object} options 配置选项
     * @returns {Object} 打印元素配置
     */
    createBarcodeElement(options) {
        return {
            options: {
                left: options.left || 20,
                top: options.top || 220,
                height: options.height || 50,
                width: options.width || 160,
                field: options.field || 'barcode',
                barcodeType: options.barcodeType || 'CODE128',
                showText: options.showText !== false,
                fontSize: options.fontSize || 12,
                textAlign: 'center'
            },
            printElementType: {
                title: '条形码',
                type: 'barcode'
            }
        }
    }

    /**
     * 创建二维码打印元素配置
     * @param {Object} options 配置选项
     * @returns {Object} 打印元素配置
     */
    createQRCodeElement(options) {
        return {
            options: {
                left: options.left || 20,
                top: options.top || 280,
                height: options.height || 80,
                width: options.width || 80,
                field: options.field || 'qrcode',
                errorLevel: options.errorLevel || 'M'
            },
            printElementType: {
                title: '二维码',
                type: 'qrcode'
            }
        }
    }
}

// 创建服务实例
export const codeService = new CodeService()

export default codeService 