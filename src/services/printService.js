import { hiprint, disAutoConnect } from 'vue-plugin-hiprint'
import { codeService } from './codeService'
import { initHiprintExtensions, createBarcodeImageElement, createQRCodeImageElement } from './hiprintExtensions'

// 取消自动连接以避免 WebSocket 错误
disAutoConnect()

/**
 * 打印服务类
 */
class PrintService {
    constructor() {
        this.hiprint = hiprint
        this.codeService = codeService
        this.init()
    }

    /**
     * 初始化打印服务
     */
    init() {
        // 简单初始化，不需要host和port配置
        this.hiprint.init()

        // 初始化扩展
        initHiprintExtensions()
    }

    /**
     * 创建打印模板
     * @param {Object} options 模板选项
     * @returns {Object} 打印模板对象
     */
    createTemplate(options = {}) {
        // 创建打印模板
        const template = new this.hiprint.PrintTemplate({
            template: options.template || this.getDefaultTemplate(),
            settingContainer: '#PrintElementOptionSetting',
            paginationContainer: '.hiprint-printPagination'
        })

        return template
    }

    /**
     * 创建包含条形码和二维码的模板
     * @param {Object} options 模板选项
     * @returns {Object} 打印模板对象
     */
    createCodeTemplate(options = {}) {
        return this.createTemplate({
            template: this.getCodeTemplate(options)
        })
    }

    /**
     * 创建标签打印模板
     * @param {Object} options 模板选项
     * @returns {Object} 打印模板对象
     */
    createLabelTemplate(options = {}) {
        return this.createTemplate({
            template: this.getLabelTemplate(options)
        })
    }

    /**
     * 创建多标签打印模板
     * @param {Object} options 模板选项
     * @returns {Object} 打印模板对象
     */
    createMultiLabelTemplate(options = {}) {
        return this.createTemplate({
            template: this.getMultiLabelTemplate(options)
        })
    }

    /**
     * 获取默认模板配置
     * @returns {Object} 模板配置
     */
    getDefaultTemplate() {
        return {
            panels: [
                {
                    index: 0,
                    height: 297,
                    width: 210,
                    paperHeader: 49.5,
                    paperFooter: 780,
                    printElements: [
                        {
                            options: {
                                left: 60,
                                top: 20,
                                height: 30,
                                width: 120,
                                title: '员工信息表',
                                fontSize: 20,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#333'
                            },
                            printElementType: {
                                title: '标题',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 20,
                                top: 70,
                                height: 20,
                                width: 60,
                                title: '姓名：',
                                fontSize: 14,
                                fontWeight: 'normal'
                            },
                            printElementType: {
                                title: '文本',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 80,
                                top: 70,
                                height: 20,
                                width: 80,
                                field: 'name',
                                fontSize: 14,
                                color: '#666'
                            },
                            printElementType: {
                                title: '姓名',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 20,
                                top: 100,
                                height: 20,
                                width: 60,
                                title: '年龄：',
                                fontSize: 14,
                                fontWeight: 'normal'
                            },
                            printElementType: {
                                title: '文本',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 80,
                                top: 100,
                                height: 20,
                                width: 80,
                                field: 'age',
                                fontSize: 14,
                                color: '#666'
                            },
                            printElementType: {
                                title: '年龄',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 20,
                                top: 130,
                                height: 20,
                                width: 60,
                                title: '部门：',
                                fontSize: 14,
                                fontWeight: 'normal'
                            },
                            printElementType: {
                                title: '文本',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 80,
                                top: 130,
                                height: 20,
                                width: 100,
                                field: 'department',
                                fontSize: 14,
                                color: '#666'
                            },
                            printElementType: {
                                title: '部门',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 20,
                                top: 160,
                                height: 20,
                                width: 60,
                                title: '职位：',
                                fontSize: 14,
                                fontWeight: 'normal'
                            },
                            printElementType: {
                                title: '文本',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 80,
                                top: 160,
                                height: 20,
                                width: 100,
                                field: 'position',
                                fontSize: 14,
                                color: '#666'
                            },
                            printElementType: {
                                title: '职位',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 20,
                                top: 190,
                                height: 20,
                                width: 60,
                                title: '薪资：',
                                fontSize: 14,
                                fontWeight: 'normal'
                            },
                            printElementType: {
                                title: '文本',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 80,
                                top: 190,
                                height: 20,
                                width: 100,
                                field: 'salary',
                                fontSize: 14,
                                color: '#666'
                            },
                            printElementType: {
                                title: '薪资',
                                type: 'text'
                            }
                        },
                        {
                            options: {
                                left: 20,
                                top: 240,
                                height: 1,
                                width: 170,
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: '#ccc'
                            },
                            printElementType: {
                                title: '横线',
                                type: 'hline'
                            }
                        },
                        {
                            options: {
                                left: 20,
                                top: 260,
                                height: 16,
                                width: 170,
                                title: '打印时间：' + new Date().toLocaleString(),
                                fontSize: 12,
                                color: '#999',
                                textAlign: 'center'
                            },
                            printElementType: {
                                title: '打印时间',
                                type: 'text'
                            }
                        }
                    ]
                }
            ]
        }
    }

    /**
     * 获取包含条形码和二维码的模板配置
     * @param {Object} options 配置选项
     * @returns {Object} 模板配置
     */
    getCodeTemplate(options = {}) {
        const baseTemplate = this.getDefaultTemplate()

        // 添加条形码图片元素
        baseTemplate.panels[0].printElements.push(createBarcodeImageElement({
            left: 20,
            top: 290,
            height: 50,
            width: 170,
            field: 'barcodeImage'
        }))

        // 添加二维码图片元素
        baseTemplate.panels[0].printElements.push(createQRCodeImageElement({
            left: 20,
            top: 360,
            height: 80,
            width: 80,
            field: 'qrcodeImage'
        }))

        // 添加二维码描述
        baseTemplate.panels[0].printElements.push({
            options: {
                left: 110,
                top: 360,
                height: 20,
                width: 80,
                title: '扫描二维码',
                fontSize: 12,
                color: '#666'
            },
            printElementType: {
                title: '二维码说明',
                type: 'text'
            }
        })

        // 添加二维码描述第二行
        baseTemplate.panels[0].printElements.push({
            options: {
                left: 110,
                top: 380,
                height: 20,
                width: 80,
                title: '查看详情',
                fontSize: 12,
                color: '#666'
            },
            printElementType: {
                title: '二维码说明2',
                type: 'text'
            }
        })

        return baseTemplate
    }

    /**
     * 获取标签打印模板配置
     * @param {Object} options 配置选项
     * @returns {Object} 模板配置
     */
    getLabelTemplate(options = {}) {
        const labelWidth = options.labelWidth || 100
        const labelHeight = options.labelHeight || 60
        const barcodeHeight = options.barcodeHeight || 30
        const fontSize = options.fontSize || 10

        return {
            panels: [
                {
                    index: 0,
                    height: labelHeight,
                    width: labelWidth,
                    paperHeader: 5,
                    paperFooter: 5,
                    printElements: [
                        // 标题文本
                        {
                            options: {
                                left: 5,
                                top: 2,
                                height: 12,
                                width: labelWidth - 10,
                                field: 'title',
                                fontSize: fontSize,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#333'
                            },
                            printElementType: {
                                title: '标题',
                                type: 'text'
                            }
                        },
                        // 条形码
                        createBarcodeImageElement({
                            left: 5,
                            top: 15,
                            height: barcodeHeight,
                            width: labelWidth - 10,
                            field: 'barcodeImage'
                        }),
                        // 条形码文本
                        {
                            options: {
                                left: 5,
                                top: 15 + barcodeHeight + 2,
                                height: 10,
                                width: labelWidth - 10,
                                field: 'barcodeText',
                                fontSize: fontSize - 2,
                                textAlign: 'center',
                                color: '#666'
                            },
                            printElementType: {
                                title: '条形码文本',
                                type: 'text'
                            }
                        }
                    ]
                }
            ]
        }
    }

    /**
     * 获取多标签打印模板配置
     * @param {Object} options 配置选项
     * @returns {Object} 模板配置
     */
    getMultiLabelTemplate(options = {}) {
        const labelWidth = options.labelWidth || 100
        const labelHeight = options.labelHeight || 60
        const barcodeHeight = options.barcodeHeight || 30
        const fontSize = options.fontSize || 10
        const rows = options.rows || 3    // 行数
        const cols = options.cols || 2    // 列数
        const marginX = options.marginX || 5  // 水平间距
        const marginY = options.marginY || 5  // 垂直间距
        const paperWidth = options.paperWidth || 210  // 纸张宽度 (A4: 210mm)
        const paperHeight = options.paperHeight || 297 // 纸张高度 (A4: 297mm)

        const printElements = []

        // 计算每个标签的实际可用宽度和高度
        const availableWidth = paperWidth - (marginX * 2)
        const availableHeight = paperHeight - (marginY * 2)
        const actualLabelWidth = (availableWidth - (marginX * (cols - 1))) / cols
        const actualLabelHeight = (availableHeight - (marginY * (rows - 1))) / rows

        // 生成多个标签布局
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const labelIndex = row * cols + col
                const baseLeft = marginX + col * (actualLabelWidth + marginX)
                const baseTop = marginY + row * (actualLabelHeight + marginY)

                // 标题文本
                printElements.push({
                    options: {
                        left: baseLeft + 2,
                        top: baseTop + 2,
                        height: 12,
                        width: actualLabelWidth - 4,
                        field: `labels[${labelIndex}].title`,
                        fontSize: fontSize,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#333'
                    },
                    printElementType: {
                        title: `标题${labelIndex + 1}`,
                        type: 'text'
                    }
                })

                // 条形码
                printElements.push(createBarcodeImageElement({
                    left: baseLeft + 2,
                    top: baseTop + 15,
                    height: barcodeHeight,
                    width: actualLabelWidth - 4,
                    field: `labels[${labelIndex}].barcodeImage`
                }))

                // 条形码文本
                printElements.push({
                    options: {
                        left: baseLeft + 2,
                        top: baseTop + 15 + barcodeHeight + 2,
                        height: 10,
                        width: actualLabelWidth - 4,
                        field: `labels[${labelIndex}].barcodeText`,
                        fontSize: fontSize - 2,
                        textAlign: 'center',
                        color: '#666'
                    },
                    printElementType: {
                        title: `条形码文本${labelIndex + 1}`,
                        type: 'text'
                    }
                })

                // 描述文本
                printElements.push({
                    options: {
                        left: baseLeft + 2,
                        top: baseTop + 15 + barcodeHeight + 12,
                        height: 8,
                        width: actualLabelWidth - 4,
                        field: `labels[${labelIndex}].description`,
                        fontSize: fontSize - 3,
                        textAlign: 'center',
                        color: '#999'
                    },
                    printElementType: {
                        title: `描述${labelIndex + 1}`,
                        type: 'text'
                    }
                })

                // 添加标签边框（可选）
                if (options.showBorder) {
                    printElements.push({
                        options: {
                            left: baseLeft,
                            top: baseTop,
                            height: actualLabelHeight,
                            width: actualLabelWidth,
                            borderStyle: 'solid',
                            borderWidth: 1,
                            borderColor: '#ddd'
                        },
                        printElementType: {
                            title: `边框${labelIndex + 1}`,
                            type: 'rect'
                        }
                    })
                }
            }
        }

        return {
            panels: [
                {
                    index: 0,
                    height: paperHeight,
                    width: paperWidth,
                    paperHeader: 10,
                    paperFooter: 10,
                    printElements: printElements
                }
            ]
        }
    }

    /**
     * 处理打印数据，生成条形码和二维码
     * @param {Object} data 原始数据
     * @param {Object} options 选项
     * @returns {Object} 处理后的数据
     */
    async processDataWithCodes(data, options = {}) {
        const processedData = { ...data }

        // 生成条形码图片数据
        if (options.includeBarcode && data.barcodeText) {
            try {
                processedData.barcodeImage = await this.codeService.generateBarcode(
                    data.barcodeText,
                    {
                        format: options.barcodeFormat || 'CODE128',
                        width: options.barcodeWidth || 2,
                        height: options.barcodeHeight || 100,
                        displayValue: options.showBarcodeText !== false
                    }
                )
            } catch (error) {
                console.error('生成条形码失败:', error)
                processedData.barcodeImage = null
            }
        }

        // 生成二维码图片数据
        if (options.includeQRCode && data.qrcodeText) {
            try {
                processedData.qrcodeImage = await this.codeService.generateQRCode(
                    data.qrcodeText,
                    {
                        width: options.qrWidth || 200,
                        errorCorrectionLevel: options.qrErrorLevel || 'M'
                    }
                )
            } catch (error) {
                console.error('生成二维码失败:', error)
                processedData.qrcodeImage = null
            }
        }

        return processedData
    }

    /**
     * 批量打印标签
     * @param {Array} dataList 打印数据列表
     * @param {Object} options 打印选项
     * @param {Function} progressCallback 进度回调
     * @returns {Promise} 打印结果
     */
    async batchPrintLabels(dataList, options = {}, progressCallback = null) {
        const template = this.createLabelTemplate(options.labelTemplate || {})
        const printOptions = {
            barcodeFormat: options.barcodeFormat || 'CODE128',
            barcodeWidth: options.barcodeWidth || 2,
            barcodeHeight: options.barcodeHeight || 80,
            showBarcodeText: options.showBarcodeText !== false,
            printInterval: options.printInterval || 1000 // 打印间隔毫秒
        }

        const results = []
        const total = dataList.length

        for (let i = 0; i < total; i++) {
            const data = dataList[i]

            try {
                // 处理数据并生成条形码
                const processedData = await this.processDataWithCodes(data, {
                    includeBarcode: true,
                    ...printOptions
                })

                // 执行打印
                await new Promise((resolve, reject) => {
                    template.print(processedData, {}, {
                        callback: () => {
                            results.push({ index: i, success: true, data: processedData })
                            resolve()
                        },
                        error: (error) => {
                            results.push({ index: i, success: false, error: error.message })
                            reject(error)
                        }
                    })
                })

                // 更新进度
                if (progressCallback) {
                    progressCallback({
                        current: i + 1,
                        total,
                        percentage: Math.round(((i + 1) / total) * 100),
                        currentData: processedData
                    })
                }

                // 等待打印间隔
                if (i < total - 1 && printOptions.printInterval > 0) {
                    await new Promise(resolve => setTimeout(resolve, printOptions.printInterval))
                }

            } catch (error) {
                console.error(`第 ${i + 1} 个标签打印失败:`, error)
                results.push({ index: i, success: false, error: error.message })

                // 更新进度（包含错误信息）
                if (progressCallback) {
                    progressCallback({
                        current: i + 1,
                        total,
                        percentage: Math.round(((i + 1) / total) * 100),
                        currentData: data,
                        error: error.message
                    })
                }
            }
        }

        return {
            total,
            success: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results
        }
    }

    /**
     * 处理多标签数据
     * @param {Array} dataList 标签数据列表
     * @param {Object} options 选项
     * @returns {Promise} 处理后的数据
     */
    async processMultiLabelData(dataList, options = {}) {
        const processedLabels = []
        const rows = options.rows || 3
        const cols = options.cols || 2
        const totalSlots = rows * cols

        for (let i = 0; i < Math.min(dataList.length, totalSlots); i++) {
            const data = dataList[i]
            if (data) {
                const processedData = await this.processDataWithCodes(data, {
                    includeBarcode: true,
                    barcodeFormat: options.barcodeFormat || 'CODE128',
                    barcodeWidth: options.barcodeWidth || 2,
                    barcodeHeight: options.barcodeHeight || 80,
                    showBarcodeText: options.showBarcodeText !== false
                })
                processedLabels.push(processedData)
            }
        }

        // 填充空白标签位置
        while (processedLabels.length < totalSlots) {
            processedLabels.push({
                title: '',
                barcodeText: '',
                barcodeImage: '',
                description: ''
            })
        }

        return { labels: processedLabels }
    }

    /**
     * 批量打印多标签
     * @param {Array} dataList 打印数据列表
     * @param {Object} options 打印选项
     * @param {Function} progressCallback 进度回调
     * @returns {Promise} 打印结果
     */
    async batchPrintMultiLabels(dataList, options = {}, progressCallback = null) {
        const template = this.createMultiLabelTemplate(options.labelTemplate || {})
        const printOptions = {
            barcodeFormat: options.barcodeFormat || 'CODE128',
            barcodeWidth: options.barcodeWidth || 2,
            barcodeHeight: options.barcodeHeight || 80,
            showBarcodeText: options.showBarcodeText !== false,
            printInterval: options.printInterval || 1000, // 打印间隔毫秒
            rows: options.rows || 3,
            cols: options.cols || 2
        }

        const results = []
        const labelsPerPage = printOptions.rows * printOptions.cols
        const totalPages = Math.ceil(dataList.length / labelsPerPage)

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            const startIndex = pageIndex * labelsPerPage
            const endIndex = Math.min(startIndex + labelsPerPage, dataList.length)
            const pageData = dataList.slice(startIndex, endIndex)

            try {
                // 处理当前页的数据
                const processedData = await this.processMultiLabelData(pageData, printOptions)

                // 执行打印
                await new Promise((resolve, reject) => {
                    template.print(processedData, {}, {
                        callback: () => {
                            results.push({ page: pageIndex + 1, success: true, data: processedData })
                            resolve()
                        },
                        error: (error) => {
                            results.push({ page: pageIndex + 1, success: false, error: error.message })
                            reject(error)
                        }
                    })
                })

                // 更新进度
                if (progressCallback) {
                    progressCallback({
                        current: pageIndex + 1,
                        total: totalPages,
                        percentage: Math.round(((pageIndex + 1) / totalPages) * 100),
                        currentData: pageData,
                        labelsThisPage: pageData.length
                    })
                }

                // 等待打印间隔
                if (pageIndex < totalPages - 1 && printOptions.printInterval > 0) {
                    await new Promise(resolve => setTimeout(resolve, printOptions.printInterval))
                }

            } catch (error) {
                console.error(`第 ${pageIndex + 1} 页多标签打印失败:`, error)
                results.push({ page: pageIndex + 1, success: false, error: error.message })

                // 更新进度（包含错误信息）
                if (progressCallback) {
                    progressCallback({
                        current: pageIndex + 1,
                        total: totalPages,
                        percentage: Math.round(((pageIndex + 1) / totalPages) * 100),
                        currentData: pageData,
                        error: error.message
                    })
                }
            }
        }

        return {
            total: totalPages,
            success: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results
        }
    }

    /**
     * 预览批量标签
     * @param {Array} dataList 打印数据列表
     * @param {Object} options 选项
     * @returns {Promise} 预览结果
     */
    async previewBatchLabels(dataList, options = {}) {
        const template = this.createLabelTemplate(options.labelTemplate || {})
        const printOptions = {
            barcodeFormat: options.barcodeFormat || 'CODE128',
            barcodeWidth: options.barcodeWidth || 2,
            barcodeHeight: options.barcodeHeight || 80,
            showBarcodeText: options.showBarcodeText !== false
        }

        // 只预览第一个数据
        if (dataList.length > 0) {
            const processedData = await this.processDataWithCodes(dataList[0], {
                includeBarcode: true,
                ...printOptions
            })

            template.preview(processedData)
            return { success: true, previewData: processedData }
        }

        return { success: false, message: '没有数据可预览' }
    }

    /**
     * 预览批量多标签
     * @param {Array} dataList 打印数据列表
     * @param {Object} options 选项
     * @returns {Promise} 预览结果
     */
    async previewBatchMultiLabels(dataList, options = {}) {
        const template = this.createMultiLabelTemplate(options.labelTemplate || {})
        const printOptions = {
            barcodeFormat: options.barcodeFormat || 'CODE128',
            barcodeWidth: options.barcodeWidth || 2,
            barcodeHeight: options.barcodeHeight || 80,
            showBarcodeText: options.showBarcodeText !== false,
            rows: options.rows || 3,
            cols: options.cols || 2
        }

        if (dataList.length > 0) {
            const labelsPerPage = printOptions.rows * printOptions.cols
            const firstPageData = dataList.slice(0, labelsPerPage)

            const processedData = await this.processMultiLabelData(firstPageData, printOptions)

            template.preview(processedData)
            return { success: true, previewData: processedData }
        }

        return { success: false, message: '没有数据可预览' }
    }

    /**
     * 获取打印机列表
     * @returns {Promise} 打印机列表
     */
    async getPrinters() {
        try {
            // 浏览器环境无法直接获取打印机列表
            console.warn('浏览器环境无法获取打印机列表')
            return []
        } catch (error) {
            console.error('获取打印机列表失败:', error)
            throw error
        }
    }

    /**
     * 设置默认打印机
     * @param {string} printerName 打印机名称
     */
    setDefaultPrinter(printerName) {
        console.log('设置默认打印机:', printerName)
    }

    /**
     * 检查打印服务状态
     * @returns {Promise} 服务状态
     */
    async checkPrintService() {
        try {
            return { status: 'ready', message: '打印服务就绪' }
        } catch (error) {
            console.error('检查打印服务状态失败:', error)
            throw error
        }
    }
}

// 创建打印服务实例
export const printService = new PrintService()

export default printService 