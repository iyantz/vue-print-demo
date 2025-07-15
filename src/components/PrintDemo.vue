<template>
  <div class="print-demo">
    <el-row :gutter="20">
      <!-- 左侧控制面板 -->
      <el-col :span="6">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <span>打印控制</span>
            </div>
          </template>

          <div class="control-panel">
            <el-button type="primary" @click="initPrint" :icon="Plus">
              初始化打印
            </el-button>

            <el-button type="success" @click="previewPrint" :icon="View">
              预览打印
            </el-button>

            <el-button type="warning" @click="directPrint" :icon="Printer">
              直接打印
            </el-button>

            <el-button type="info" @click="exportPdf" :icon="Download">
              导出PDF
            </el-button>

            <el-divider />

            <h4>打印设置</h4>
            <el-form label-width="80px">
              <el-form-item label="模板类型">
                <el-radio-group v-model="printSettings.templateType">
                  <el-radio label="default">基础模板</el-radio>
                  <el-radio label="code">条码模板</el-radio>
                  <el-radio label="label">标签模板</el-radio>
                  <el-radio label="multiLabel">多标签模板</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="纸张大小">
                <el-select
                  v-model="printSettings.paperSize"
                  placeholder="选择纸张大小"
                >
                  <el-option label="A4" value="A4" />
                  <el-option label="A3" value="A3" />
                  <el-option label="A5" value="A5" />
                  <el-option label="自定义" value="custom" />
                </el-select>
              </el-form-item>

              <el-form-item label="方向">
                <el-radio-group v-model="printSettings.orientation">
                  <el-radio label="portrait">竖向</el-radio>
                  <el-radio label="landscape">横向</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="边距">
                <el-input-number
                  v-model="printSettings.margin"
                  :min="0"
                  :max="50"
                />
              </el-form-item>
            </el-form>

            <el-divider />

            <!-- 标签设置 -->
            <div v-if="printSettings.templateType === 'label'">
              <h4>标签设置</h4>
              <el-form label-width="80px">
                <el-form-item label="标签宽度">
                  <el-input-number
                    v-model="labelSettings.width"
                    :min="50"
                    :max="200"
                    :step="10"
                  />
                </el-form-item>

                <el-form-item label="标签高度">
                  <el-input-number
                    v-model="labelSettings.height"
                    :min="30"
                    :max="150"
                    :step="5"
                  />
                </el-form-item>

                <el-form-item label="条形码高度">
                  <el-input-number
                    v-model="labelSettings.barcodeHeight"
                    :min="20"
                    :max="80"
                    :step="5"
                  />
                </el-form-item>

                <el-form-item label="字体大小">
                  <el-input-number
                    v-model="labelSettings.fontSize"
                    :min="8"
                    :max="20"
                    :step="1"
                  />
                </el-form-item>

                <el-form-item label="条形码格式">
                  <el-select
                    v-model="labelSettings.barcodeFormat"
                    placeholder="选择条形码格式"
                  >
                    <el-option
                      v-for="format in barcodeFormats"
                      :key="format.value"
                      :label="format.label"
                      :value="format.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="显示条码文本">
                  <el-switch v-model="labelSettings.showBarcodeText" />
                </el-form-item>
              </el-form>

              <el-divider />

              <h4>批量打印设置</h4>
              <el-form label-width="80px">
                <el-form-item label="打印间隔">
                  <el-input-number
                    v-model="batchSettings.printInterval"
                    :min="500"
                    :max="10000"
                    :step="500"
                  />
                  <span style="margin-left: 10px; color: #666; font-size: 12px"
                    >毫秒</span
                  >
                </el-form-item>

                <el-form-item label="批量模式">
                  <el-switch v-model="batchSettings.enabled" />
                </el-form-item>
              </el-form>

              <el-divider />

              <h4>批量打印控制</h4>
              <div class="batch-controls">
                <el-button
                  type="primary"
                  @click="previewBatchLabels"
                  :disabled="batchPrintData.length === 0"
                  style="width: 100%"
                >
                  预览标签
                </el-button>

                <el-button
                  type="success"
                  @click="startBatchPrint"
                  :disabled="
                    batchPrintData.length === 0 || batchPrintStatus.printing
                  "
                  style="width: 100%"
                >
                  开始批量打印
                </el-button>

                <el-button
                  type="danger"
                  @click="stopBatchPrint"
                  :disabled="!batchPrintStatus.printing"
                  style="width: 100%"
                >
                  停止打印
                </el-button>
              </div>

              <!-- 打印进度 -->
              <div
                v-if="batchPrintStatus.printing || batchPrintStatus.completed"
                class="print-progress"
              >
                <el-progress
                  :percentage="batchPrintStatus.progress"
                  :status="batchPrintStatus.completed ? 'success' : 'active'"
                />
                <p class="progress-text">
                  {{ batchPrintStatus.current }}/{{ batchPrintStatus.total }}
                  <span v-if="batchPrintStatus.currentItem"
                    >({{ batchPrintStatus.currentItem }})</span
                  >
                </p>
              </div>
            </div>

            <!-- 多标签设置 -->
            <div v-if="printSettings.templateType === 'multiLabel'">
              <h4>多标签布局设置</h4>
              <el-form label-width="80px">
                <el-form-item label="纸张大小">
                  <el-select v-model="multiLabelSettings.paperSize">
                    <el-option label="A4 (210×297mm)" value="A4" />
                    <el-option label="A3 (297×420mm)" value="A3" />
                    <el-option label="A5 (148×210mm)" value="A5" />
                    <el-option label="自定义" value="custom" />
                  </el-select>
                </el-form-item>

                <el-form-item
                  v-if="multiLabelSettings.paperSize === 'custom'"
                  label="纸张宽度"
                >
                  <el-input-number
                    v-model="multiLabelSettings.paperWidth"
                    :min="100"
                    :max="500"
                    :step="10"
                  />
                  <span style="margin-left: 10px; color: #666; font-size: 12px"
                    >mm</span
                  >
                </el-form-item>

                <el-form-item
                  v-if="multiLabelSettings.paperSize === 'custom'"
                  label="纸张高度"
                >
                  <el-input-number
                    v-model="multiLabelSettings.paperHeight"
                    :min="100"
                    :max="500"
                    :step="10"
                  />
                  <span style="margin-left: 10px; color: #666; font-size: 12px"
                    >mm</span
                  >
                </el-form-item>

                <el-form-item label="每行标签数">
                  <el-input-number
                    v-model="multiLabelSettings.cols"
                    :min="1"
                    :max="6"
                    :step="1"
                  />
                </el-form-item>

                <el-form-item label="每列标签数">
                  <el-input-number
                    v-model="multiLabelSettings.rows"
                    :min="1"
                    :max="10"
                    :step="1"
                  />
                </el-form-item>

                <el-form-item label="水平间距">
                  <el-input-number
                    v-model="multiLabelSettings.marginX"
                    :min="0"
                    :max="20"
                    :step="1"
                  />
                  <span style="margin-left: 10px; color: #666; font-size: 12px"
                    >mm</span
                  >
                </el-form-item>

                <el-form-item label="垂直间距">
                  <el-input-number
                    v-model="multiLabelSettings.marginY"
                    :min="0"
                    :max="20"
                    :step="1"
                  />
                  <span style="margin-left: 10px; color: #666; font-size: 12px"
                    >mm</span
                  >
                </el-form-item>

                <el-form-item label="条形码高度">
                  <el-input-number
                    v-model="multiLabelSettings.barcodeHeight"
                    :min="10"
                    :max="40"
                    :step="2"
                  />
                  <span style="margin-left: 10px; color: #666; font-size: 12px"
                    >mm</span
                  >
                </el-form-item>

                <el-form-item label="字体大小">
                  <el-input-number
                    v-model="multiLabelSettings.fontSize"
                    :min="6"
                    :max="16"
                    :step="1"
                  />
                </el-form-item>

                <el-form-item label="条形码格式">
                  <el-select
                    v-model="multiLabelSettings.barcodeFormat"
                    placeholder="选择条形码格式"
                  >
                    <el-option
                      v-for="format in barcodeFormats"
                      :key="format.value"
                      :label="format.label"
                      :value="format.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="显示条码文本">
                  <el-switch v-model="multiLabelSettings.showBarcodeText" />
                </el-form-item>

                <el-form-item label="显示标签边框">
                  <el-switch v-model="multiLabelSettings.showBorder" />
                </el-form-item>
              </el-form>

              <el-divider />

              <h4>多标签打印预览</h4>
              <div class="multi-label-info">
                <p>
                  每页标签数：{{
                    multiLabelSettings.rows * multiLabelSettings.cols
                  }}
                </p>
                <p>
                  总页数：{{
                    Math.ceil(
                      batchPrintData.length /
                        (multiLabelSettings.rows * multiLabelSettings.cols)
                    )
                  }}
                </p>
              </div>

              <el-divider />

              <h4>多标签打印控制</h4>
              <div class="batch-controls">
                <el-button
                  type="primary"
                  @click="previewMultiLabels"
                  :disabled="batchPrintData.length === 0"
                  style="width: 100%"
                >
                  预览多标签
                </el-button>

                <el-button
                  type="success"
                  @click="startMultiLabelPrint"
                  :disabled="
                    batchPrintData.length === 0 || batchPrintStatus.printing
                  "
                  style="width: 100%"
                >
                  开始多标签打印
                </el-button>

                <el-button
                  type="danger"
                  @click="stopBatchPrint"
                  :disabled="!batchPrintStatus.printing"
                  style="width: 100%"
                >
                  停止打印
                </el-button>
              </div>

              <!-- 打印进度 -->
              <div
                v-if="batchPrintStatus.printing || batchPrintStatus.completed"
                class="print-progress"
              >
                <el-progress
                  :percentage="batchPrintStatus.progress"
                  :status="batchPrintStatus.completed ? 'success' : 'active'"
                />
                <p class="progress-text">
                  {{ batchPrintStatus.current }}/{{ batchPrintStatus.total }}
                  <span v-if="batchPrintStatus.labelsThisPage">
                    (本页 {{ batchPrintStatus.labelsThisPage }} 个标签)
                  </span>
                </p>
              </div>
            </div>

            <!-- 条形码设置 -->
            <div v-if="printSettings.templateType === 'code'">
              <h4>条形码设置</h4>
              <el-form label-width="80px">
                <el-form-item label="启用条形码">
                  <el-switch v-model="codeSettings.includeBarcode" />
                </el-form-item>

                <el-form-item
                  label="条形码内容"
                  v-if="codeSettings.includeBarcode"
                >
                  <el-input
                    v-model="codeSettings.barcodeText"
                    placeholder="请输入条形码内容"
                  />
                </el-form-item>

                <el-form-item
                  label="条形码格式"
                  v-if="codeSettings.includeBarcode"
                >
                  <el-select
                    v-model="codeSettings.barcodeFormat"
                    placeholder="选择条形码格式"
                  >
                    <el-option
                      v-for="format in barcodeFormats"
                      :key="format.value"
                      :label="format.label"
                      :value="format.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="显示文本"
                  v-if="codeSettings.includeBarcode"
                >
                  <el-switch v-model="codeSettings.showBarcodeText" />
                </el-form-item>
              </el-form>

              <el-divider />

              <!-- 二维码设置 -->
              <h4>二维码设置</h4>
              <el-form label-width="80px">
                <el-form-item label="启用二维码">
                  <el-switch v-model="codeSettings.includeQRCode" />
                </el-form-item>

                <el-form-item
                  label="二维码内容"
                  v-if="codeSettings.includeQRCode"
                >
                  <el-input
                    v-model="codeSettings.qrcodeText"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入二维码内容"
                  />
                </el-form-item>

                <el-form-item
                  label="纠错等级"
                  v-if="codeSettings.includeQRCode"
                >
                  <el-select
                    v-model="codeSettings.qrErrorLevel"
                    placeholder="选择纠错等级"
                  >
                    <el-option
                      v-for="level in qrErrorLevels"
                      :key="level.value"
                      :label="level.label"
                      :value="level.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>

              <el-divider />

              <!-- 预览区域 -->
              <h4>码预览</h4>
              <div class="code-preview">
                <div
                  v-if="codeSettings.includeBarcode && barcodePreview"
                  class="barcode-preview"
                >
                  <p>条形码预览：</p>
                  <img :src="barcodePreview" alt="条形码预览" />
                </div>
                <div
                  v-if="codeSettings.includeQRCode && qrcodePreview"
                  class="qrcode-preview"
                >
                  <p>二维码预览：</p>
                  <img :src="qrcodePreview" alt="二维码预览" />
                </div>
              </div>

              <el-button
                type="primary"
                @click="generatePreviews"
                style="width: 100%"
              >
                生成预览
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧打印区域 -->
      <el-col :span="18">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <span>打印预览区域</span>
            </div>
          </template>

          <div class="print-area">
            <div id="hiprint-printTemplate" ref="printTemplate"></div>
            <div id="PrintElementOptionSetting" style="display: none"></div>
            <div class="hiprint-printPagination"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 批量打印数据管理 -->
    <el-row
      :gutter="20"
      style="margin-top: 20px"
      v-if="
        printSettings.templateType === 'label' ||
        printSettings.templateType === 'multiLabel'
      "
    >
      <el-col :span="24">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <span>批量打印数据</span>
              <div>
                <el-button type="text" @click="addBatchData"
                  >添加数据</el-button
                >
                <el-button type="text" @click="clearBatchData"
                  >清空数据</el-button
                >
                <el-button type="text" @click="importBatchData"
                  >导入数据</el-button
                >
                <el-button type="text" @click="exportBatchData"
                  >导出数据</el-button
                >
              </div>
            </div>
          </template>

          <div class="batch-data-container">
            <el-table
              :data="batchPrintData"
              style="width: 100%"
              max-height="300"
            >
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="title" label="标题" width="120">
                <template #default="{ row, $index }">
                  <el-input v-model="row.title" size="small" />
                </template>
              </el-table-column>
              <el-table-column
                prop="barcodeText"
                label="条形码内容"
                width="150"
              >
                <template #default="{ row, $index }">
                  <el-input v-model="row.barcodeText" size="small" />
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" min-width="150">
                <template #default="{ row, $index }">
                  <el-input v-model="row.description" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="{ row, $index }">
                  <el-button
                    type="text"
                    size="small"
                    @click="duplicateBatchData($index)"
                  >
                    复制
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="removeBatchData($index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="batch-data-actions" style="margin-top: 15px">
              <el-button type="primary" @click="generateBatchCodes"
                >生成条形码</el-button
              >
              <span style="margin-left: 15px; color: #666">
                共 {{ batchPrintData.length }} 条数据
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 示例数据 -->
    <el-row
      :gutter="20"
      style="margin-top: 20px"
      v-if="printSettings.templateType !== 'label'"
    >
      <el-col :span="24">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <span>示例数据</span>
              <el-button type="text" @click="updateData">更新数据</el-button>
            </div>
          </template>

          <el-table :data="sampleData" style="width: 100%">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="age" label="年龄" />
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="position" label="职位" />
            <el-table-column prop="salary" label="薪资" />
            <el-table-column
              prop="barcodeText"
              label="条形码内容"
              v-if="codeSettings.includeBarcode"
            />
            <el-table-column
              prop="qrcodeText"
              label="二维码内容"
              v-if="codeSettings.includeQRCode"
            />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Plus, View, Printer, Download } from "@element-plus/icons-vue";
import { printService } from "../services/printService";
import { codeService } from "../services/codeService";

export default {
  name: "PrintDemo",
  components: {
    Plus,
    View,
    Printer,
    Download,
  },
  data() {
    return {
      hiprintTemplate: null,
      printSettings: {
        templateType: "default",
        paperSize: "A4",
        orientation: "portrait",
        margin: 10,
      },
      labelSettings: {
        width: 100,
        height: 60,
        barcodeHeight: 30,
        fontSize: 10,
        barcodeFormat: "CODE128",
        showBarcodeText: true,
      },
      multiLabelSettings: {
        paperSize: "A4",
        paperWidth: 210,
        paperHeight: 297,
        rows: 3,
        cols: 2,
        marginX: 5,
        marginY: 5,
        barcodeHeight: 25,
        fontSize: 9,
        barcodeFormat: "CODE128",
        showBarcodeText: true,
        showBorder: false,
      },
      batchSettings: {
        enabled: false,
        printInterval: 1000,
      },
      codeSettings: {
        includeBarcode: false,
        barcodeText: "123456789012",
        barcodeFormat: "CODE128",
        showBarcodeText: true,
        includeQRCode: false,
        qrcodeText: "https://example.com",
        qrErrorLevel: "M",
      },
      barcodeFormats: [],
      qrErrorLevels: [],
      barcodePreview: null,
      qrcodePreview: null,
      batchPrintData: [],
      batchPrintStatus: {
        printing: false,
        completed: false,
        progress: 0,
        current: 0,
        total: 0,
        currentItem: "",
      },
      sampleData: [
        {
          name: "张三",
          age: 28,
          department: "技术部",
          position: "前端工程师",
          salary: "12000",
          barcodeText: "EMP001",
          qrcodeText: "员工编号：EMP001\n姓名：张三\n部门：技术部",
        },
        {
          name: "李四",
          age: 32,
          department: "产品部",
          position: "产品经理",
          salary: "15000",
          barcodeText: "EMP002",
          qrcodeText: "员工编号：EMP002\n姓名：李四\n部门：产品部",
        },
        {
          name: "王五",
          age: 26,
          department: "设计部",
          position: "UI设计师",
          salary: "10000",
          barcodeText: "EMP003",
          qrcodeText: "员工编号：EMP003\n姓名：王五\n部门：设计部",
        },
      ],
    };
  },
  watch: {
    "codeSettings.barcodeText"() {
      this.generateBarcodePreview();
    },
    "codeSettings.barcodeFormat"() {
      this.generateBarcodePreview();
    },
    "codeSettings.qrcodeText"() {
      this.generateQRCodePreview();
    },
    "codeSettings.qrErrorLevel"() {
      this.generateQRCodePreview();
    },
    "printSettings.templateType"() {
      this.initPrint();
    },
    "multiLabelSettings.paperSize"() {
      this.updatePaperSize();
    },
  },
  mounted() {
    this.initOptions();
    this.initPrint();
    this.initBatchData();
  },
  methods: {
    // 初始化选项
    initOptions() {
      this.barcodeFormats = codeService.getSupportedBarcodeFormats();
      this.qrErrorLevels = codeService.getQRCodeErrorLevels();
    },

    // 初始化批量数据
    initBatchData() {
      this.batchPrintData = [
        {
          title: "产品标签",
          barcodeText: "PRD001",
          description: "产品编号PRD001",
        },
        {
          title: "产品标签",
          barcodeText: "PRD002",
          description: "产品编号PRD002",
        },
        {
          title: "产品标签",
          barcodeText: "PRD003",
          description: "产品编号PRD003",
        },
      ];
    },

    // 初始化打印
    initPrint() {
      try {
        if (this.printSettings.templateType === "code") {
          this.hiprintTemplate = printService.createCodeTemplate({
            barcodeFormat: this.codeSettings.barcodeFormat,
            showBarcodeText: this.codeSettings.showBarcodeText,
            qrErrorLevel: this.codeSettings.qrErrorLevel,
          });
        } else if (this.printSettings.templateType === "label") {
          this.hiprintTemplate = printService.createLabelTemplate({
            labelWidth: this.labelSettings.width,
            labelHeight: this.labelSettings.height,
            barcodeHeight: this.labelSettings.barcodeHeight,
            fontSize: this.labelSettings.fontSize,
          });
        } else if (this.printSettings.templateType === "multiLabel") {
          this.hiprintTemplate = printService.createMultiLabelTemplate({
            ...this.getMultiLabelOptions(),
          });
        } else {
          this.hiprintTemplate = printService.createTemplate();
        }

        this.hiprintTemplate.design("#hiprint-printTemplate");
        this.$message.success("打印初始化成功");
      } catch (error) {
        console.error("打印初始化失败:", error);
        this.$message.error("打印初始化失败: " + error.message);
      }
    },

    // 预览打印
    async previewPrint() {
      if (!this.hiprintTemplate) {
        this.$message.error("请先初始化打印");
        return;
      }

      try {
        let printData = this.sampleData[0];

        // 如果是条码模板，需要处理条码数据
        if (this.printSettings.templateType === "code") {
          printData = await printService.processDataWithCodes(printData, {
            includeBarcode: this.codeSettings.includeBarcode,
            includeQRCode: this.codeSettings.includeQRCode,
            barcodeFormat: this.codeSettings.barcodeFormat,
            showBarcodeText: this.codeSettings.showBarcodeText,
            qrErrorLevel: this.codeSettings.qrErrorLevel,
          });
        } else if (
          this.printSettings.templateType === "label" &&
          this.batchPrintData.length > 0
        ) {
          printData = await printService.processDataWithCodes(
            this.batchPrintData[0],
            {
              includeBarcode: true,
              barcodeFormat: this.labelSettings.barcodeFormat,
              showBarcodeText: this.labelSettings.showBarcodeText,
            }
          );
        }

        this.hiprintTemplate.preview(printData);
        this.$message.success("预览打印成功");
      } catch (error) {
        console.error("预览打印失败:", error);
        this.$message.error("预览打印失败: " + error.message);
      }
    },

    // 直接打印
    async directPrint() {
      if (!this.hiprintTemplate) {
        this.$message.error("请先初始化打印");
        return;
      }

      try {
        let printData = this.sampleData[0];

        // 如果是条码模板，需要处理条码数据
        if (this.printSettings.templateType === "code") {
          printData = await printService.processDataWithCodes(printData, {
            includeBarcode: this.codeSettings.includeBarcode,
            includeQRCode: this.codeSettings.includeQRCode,
            barcodeFormat: this.codeSettings.barcodeFormat,
            showBarcodeText: this.codeSettings.showBarcodeText,
            qrErrorLevel: this.codeSettings.qrErrorLevel,
          });
        } else if (
          this.printSettings.templateType === "label" &&
          this.batchPrintData.length > 0
        ) {
          printData = await printService.processDataWithCodes(
            this.batchPrintData[0],
            {
              includeBarcode: true,
              barcodeFormat: this.labelSettings.barcodeFormat,
              showBarcodeText: this.labelSettings.showBarcodeText,
            }
          );
        }

        this.hiprintTemplate.print(
          printData,
          {},
          {
            callback: () => {
              this.$message.success("打印窗口已打开");
            },
          }
        );
      } catch (error) {
        console.error("打印失败:", error);
        this.$message.error("打印失败: " + error.message);
      }
    },

    // 导出PDF
    async exportPdf() {
      if (!this.hiprintTemplate) {
        this.$message.error("请先初始化打印");
        return;
      }

      try {
        let printData = this.sampleData[0];

        // 如果是条码模板，需要处理条码数据
        if (this.printSettings.templateType === "code") {
          printData = await printService.processDataWithCodes(printData, {
            includeBarcode: this.codeSettings.includeBarcode,
            includeQRCode: this.codeSettings.includeQRCode,
            barcodeFormat: this.codeSettings.barcodeFormat,
            showBarcodeText: this.codeSettings.showBarcodeText,
            qrErrorLevel: this.codeSettings.qrErrorLevel,
          });
        } else if (
          this.printSettings.templateType === "label" &&
          this.batchPrintData.length > 0
        ) {
          printData = await printService.processDataWithCodes(
            this.batchPrintData[0],
            {
              includeBarcode: true,
              barcodeFormat: this.labelSettings.barcodeFormat,
              showBarcodeText: this.labelSettings.showBarcodeText,
            }
          );
        }

        this.hiprintTemplate.toPdf(printData);
        this.$message.success("PDF导出成功");
      } catch (error) {
        console.error("PDF导出失败:", error);
        this.$message.error("PDF导出失败: " + error.message);
      }
    },

    // 预览批量标签
    async previewBatchLabels() {
      if (this.batchPrintData.length === 0) {
        this.$message.error("请先添加打印数据");
        return;
      }

      try {
        const result = await printService.previewBatchLabels(
          this.batchPrintData,
          {
            labelTemplate: {
              labelWidth: this.labelSettings.width,
              labelHeight: this.labelSettings.height,
              barcodeHeight: this.labelSettings.barcodeHeight,
              fontSize: this.labelSettings.fontSize,
            },
            barcodeFormat: this.labelSettings.barcodeFormat,
            showBarcodeText: this.labelSettings.showBarcodeText,
          }
        );

        if (result.success) {
          this.$message.success("标签预览成功");
        } else {
          this.$message.error(result.message);
        }
      } catch (error) {
        console.error("预览失败:", error);
        this.$message.error("预览失败: " + error.message);
      }
    },

    // 开始批量打印
    async startBatchPrint() {
      if (this.batchPrintData.length === 0) {
        this.$message.error("请先添加打印数据");
        return;
      }

      this.batchPrintStatus = {
        printing: true,
        completed: false,
        progress: 0,
        current: 0,
        total: this.batchPrintData.length,
        currentItem: "",
      };

      try {
        const result = await printService.batchPrintLabels(
          this.batchPrintData,
          {
            labelTemplate: {
              labelWidth: this.labelSettings.width,
              labelHeight: this.labelSettings.height,
              barcodeHeight: this.labelSettings.barcodeHeight,
              fontSize: this.labelSettings.fontSize,
            },
            barcodeFormat: this.labelSettings.barcodeFormat,
            showBarcodeText: this.labelSettings.showBarcodeText,
            printInterval: this.batchSettings.printInterval,
          },
          (progress) => {
            this.batchPrintStatus.current = progress.current;
            this.batchPrintStatus.progress = progress.percentage;
            this.batchPrintStatus.currentItem =
              progress.currentData?.title || "";

            if (progress.error) {
              this.$message.error(
                `第 ${progress.current} 项打印失败: ${progress.error}`
              );
            }
          }
        );

        this.batchPrintStatus.printing = false;
        this.batchPrintStatus.completed = true;

        this.$message.success(
          `批量打印完成！成功：${result.success}，失败：${result.failed}`
        );
      } catch (error) {
        console.error("批量打印失败:", error);
        this.$message.error("批量打印失败: " + error.message);
        this.batchPrintStatus.printing = false;
      }
    },

    // 停止批量打印
    stopBatchPrint() {
      this.batchPrintStatus.printing = false;
      this.$message.info("批量打印已停止");
    },

    // 添加批量数据
    addBatchData() {
      this.batchPrintData.push({
        title: "新标签",
        barcodeText: "NEW" + String(Date.now()).slice(-6),
        description: "新添加的标签",
      });
    },

    // 清空批量数据
    clearBatchData() {
      this.$confirm("确定要清空所有数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.batchPrintData = [];
        this.$message.success("数据已清空");
      });
    },

    // 复制批量数据
    duplicateBatchData(index) {
      const data = { ...this.batchPrintData[index] };
      data.barcodeText = data.barcodeText + "_COPY";
      this.batchPrintData.splice(index + 1, 0, data);
    },

    // 删除批量数据
    removeBatchData(index) {
      this.batchPrintData.splice(index, 1);
    },

    // 导入批量数据
    importBatchData() {
      // 创建隐藏的文件输入元素
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json,.csv,.txt";
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target.result);
              if (Array.isArray(data)) {
                this.batchPrintData = data;
                this.$message.success("数据导入成功");
              } else {
                this.$message.error("数据格式错误，请确保是JSON数组格式");
              }
            } catch (error) {
              this.$message.error("文件解析失败");
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    },

    // 导出批量数据
    exportBatchData() {
      if (this.batchPrintData.length === 0) {
        this.$message.error("没有数据可导出");
        return;
      }

      const dataStr = JSON.stringify(this.batchPrintData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `batch_print_data_${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      this.$message.success("数据导出成功");
    },

    // 生成批量条形码
    async generateBatchCodes() {
      if (this.batchPrintData.length === 0) {
        this.$message.error("没有数据可生成");
        return;
      }

      try {
        const processedData = [];
        for (const item of this.batchPrintData) {
          const processed = await printService.processDataWithCodes(item, {
            includeBarcode: true,
            barcodeFormat: this.labelSettings.barcodeFormat,
            showBarcodeText: this.labelSettings.showBarcodeText,
          });
          processedData.push(processed);
        }

        this.$message.success("条形码生成成功");
      } catch (error) {
        console.error("条形码生成失败:", error);
        this.$message.error("条形码生成失败: " + error.message);
      }
    },

    // 生成条形码预览
    async generateBarcodePreview() {
      if (!this.codeSettings.includeBarcode || !this.codeSettings.barcodeText) {
        this.barcodePreview = null;
        return;
      }

      try {
        this.barcodePreview = await codeService.generateBarcode(
          this.codeSettings.barcodeText,
          {
            format: this.codeSettings.barcodeFormat,
            width: 1,
            height: 50,
            displayValue: this.codeSettings.showBarcodeText,
          }
        );
      } catch (error) {
        console.error("生成条形码预览失败:", error);
        this.$message.error("生成条形码预览失败: " + error.message);
      }
    },

    // 生成二维码预览
    async generateQRCodePreview() {
      if (!this.codeSettings.includeQRCode || !this.codeSettings.qrcodeText) {
        this.qrcodePreview = null;
        return;
      }

      try {
        this.qrcodePreview = await codeService.generateQRCode(
          this.codeSettings.qrcodeText,
          {
            width: 100,
            errorCorrectionLevel: this.codeSettings.qrErrorLevel,
          }
        );
      } catch (error) {
        console.error("生成二维码预览失败:", error);
        this.$message.error("生成二维码预览失败: " + error.message);
      }
    },

    // 生成预览
    async generatePreviews() {
      await this.generateBarcodePreview();
      await this.generateQRCodePreview();
      this.$message.success("预览生成成功");
    },

    // 更新数据
    updateData() {
      const newUser = {
        name: "新用户" + Date.now(),
        age: Math.floor(Math.random() * 30) + 20,
        department: "新部门",
        position: "新职位",
        salary: Math.floor(Math.random() * 20000) + 8000,
        barcodeText: "EMP" + String(Date.now()).slice(-6),
        qrcodeText: `员工编号：EMP${String(Date.now()).slice(
          -6
        )}\n姓名：新用户${Date.now()}\n部门：新部门`,
      };

      this.sampleData.push(newUser);
      this.$message.success("数据更新成功");
    },

    // 获取多标签选项
    getMultiLabelOptions() {
      let paperWidth = this.multiLabelSettings.paperWidth;
      let paperHeight = this.multiLabelSettings.paperHeight;

      // 根据纸张大小设置尺寸
      switch (this.multiLabelSettings.paperSize) {
        case "A4":
          paperWidth = 210;
          paperHeight = 297;
          break;
        case "A3":
          paperWidth = 297;
          paperHeight = 420;
          break;
        case "A5":
          paperWidth = 148;
          paperHeight = 210;
          break;
        case "custom":
          // 使用自定义尺寸
          break;
      }

      return {
        paperWidth,
        paperHeight,
        rows: this.multiLabelSettings.rows,
        cols: this.multiLabelSettings.cols,
        marginX: this.multiLabelSettings.marginX,
        marginY: this.multiLabelSettings.marginY,
        barcodeHeight: this.multiLabelSettings.barcodeHeight,
        fontSize: this.multiLabelSettings.fontSize,
        showBorder: this.multiLabelSettings.showBorder,
      };
    },

    // 更新纸张大小
    updatePaperSize() {
      if (this.multiLabelSettings.paperSize === "A4") {
        this.multiLabelSettings.paperWidth = 210;
        this.multiLabelSettings.paperHeight = 297;
      } else if (this.multiLabelSettings.paperSize === "A3") {
        this.multiLabelSettings.paperWidth = 297;
        this.multiLabelSettings.paperHeight = 420;
      } else if (this.multiLabelSettings.paperSize === "A5") {
        this.multiLabelSettings.paperWidth = 148;
        this.multiLabelSettings.paperHeight = 210;
      }
    },

    // 预览多标签
    async previewMultiLabels() {
      if (this.batchPrintData.length === 0) {
        this.$message.error("请先添加打印数据");
        return;
      }

      try {
        const result = await printService.previewBatchMultiLabels(
          this.batchPrintData,
          {
            labelTemplate: this.getMultiLabelOptions(),
            barcodeFormat: this.multiLabelSettings.barcodeFormat,
            showBarcodeText: this.multiLabelSettings.showBarcodeText,
            rows: this.multiLabelSettings.rows,
            cols: this.multiLabelSettings.cols,
          }
        );

        if (result.success) {
          this.$message.success("多标签预览成功");
        } else {
          this.$message.error(result.message);
        }
      } catch (error) {
        console.error("预览失败:", error);
        this.$message.error("预览失败: " + error.message);
      }
    },

    // 开始多标签打印
    async startMultiLabelPrint() {
      if (this.batchPrintData.length === 0) {
        this.$message.error("请先添加打印数据");
        return;
      }

      const labelsPerPage =
        this.multiLabelSettings.rows * this.multiLabelSettings.cols;
      const totalPages = Math.ceil(this.batchPrintData.length / labelsPerPage);

      this.batchPrintStatus = {
        printing: true,
        completed: false,
        progress: 0,
        current: 0,
        total: totalPages,
        currentItem: "",
        labelsThisPage: 0,
      };

      try {
        const result = await printService.batchPrintMultiLabels(
          this.batchPrintData,
          {
            labelTemplate: this.getMultiLabelOptions(),
            barcodeFormat: this.multiLabelSettings.barcodeFormat,
            showBarcodeText: this.multiLabelSettings.showBarcodeText,
            printInterval: this.batchSettings.printInterval,
            rows: this.multiLabelSettings.rows,
            cols: this.multiLabelSettings.cols,
          },
          (progress) => {
            this.batchPrintStatus.current = progress.current;
            this.batchPrintStatus.progress = progress.percentage;
            this.batchPrintStatus.labelsThisPage = progress.labelsThisPage || 0;

            if (progress.error) {
              this.$message.error(
                `第 ${progress.current} 页打印失败: ${progress.error}`
              );
            }
          }
        );

        this.batchPrintStatus.printing = false;
        this.batchPrintStatus.completed = true;

        this.$message.success(
          `多标签打印完成！成功：${result.success} 页，失败：${result.failed} 页`
        );
      } catch (error) {
        console.error("多标签打印失败:", error);
        this.$message.error("多标签打印失败: " + error.message);
        this.batchPrintStatus.printing = false;
      }
    },
  },
};
</script>

<style scoped>
.print-demo {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-panel .el-button {
  width: 100%;
}

.print-area {
  min-height: 500px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
}

#hiprint-printTemplate {
  width: 100%;
  height: 100%;
  min-height: 460px;
}

.code-preview {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fafafa;
}

.barcode-preview,
.qrcode-preview {
  margin-bottom: 10px;
}

.barcode-preview img,
.qrcode-preview img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.barcode-preview p,
.qrcode-preview p {
  margin: 0 0 5px 0;
  font-size: 12px;
  color: #666;
}

.batch-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.print-progress {
  margin-top: 15px;
}

.progress-text {
  margin: 10px 0 0 0;
  font-size: 12px;
  color: #666;
  text-align: center;
}

.batch-data-container {
  max-height: 400px;
  overflow-y: auto;
}

.batch-data-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid #eee;
}

.multi-label-info {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.multi-label-info p {
  margin: 5px 0;
  color: #495057;
  font-size: 14px;
}
</style>
