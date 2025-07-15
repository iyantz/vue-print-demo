<template>
  <div class="drag-design-demo">
    <el-row :gutter="20">
      <!-- 左侧元素工具栏 -->
      <el-col :span="4">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <span>设计元素</span>
            </div>
          </template>

          <div class="element-toolbar">
            <h4>基础元素</h4>
            <div class="element-group">
              <div
                class="element-item"
                draggable="true"
                @dragstart="handleDragStart($event, 'text')"
              >
                <el-icon><Edit /></el-icon>
                <span>文本</span>
              </div>

              <div
                class="element-item"
                draggable="true"
                @dragstart="handleDragStart($event, 'image')"
              >
                <el-icon><Picture /></el-icon>
                <span>图片</span>
              </div>

              <div
                class="element-item"
                draggable="true"
                @dragstart="handleDragStart($event, 'line')"
              >
                <el-icon><Minus /></el-icon>
                <span>线条</span>
              </div>

              <div
                class="element-item"
                draggable="true"
                @dragstart="handleDragStart($event, 'rectangle')"
              >
                <el-icon><Grid /></el-icon>
                <span>矩形</span>
              </div>
            </div>

            <h4>条码元素</h4>
            <div class="element-group">
              <div
                class="element-item"
                draggable="true"
                @dragstart="handleDragStart($event, 'barcode')"
              >
                <el-icon><Postcard /></el-icon>
                <span>条形码</span>
              </div>

              <div
                class="element-item"
                draggable="true"
                @dragstart="handleDragStart($event, 'qrcode')"
              >
                <el-icon><Grid /></el-icon>
                <span>二维码</span>
              </div>
            </div>

            <h4>表格元素</h4>
            <div class="element-group">
              <div
                class="element-item"
                draggable="true"
                @dragstart="handleDragStart($event, 'table')"
              >
                <el-icon><Grid /></el-icon>
                <span>表格</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 中间设计区域 -->
      <el-col :span="12">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <span>设计区域</span>
              <div class="header-actions">
                <el-button size="small" @click="clearDesign">清空</el-button>
                <el-button size="small" @click="previewDesign" type="primary"
                  >预览</el-button
                >
                <el-button size="small" @click="printDesign" type="success"
                  >打印</el-button
                >
              </div>
            </div>
          </template>

          <div class="design-container">
            <!-- 设计画布 -->
            <div
              class="design-canvas"
              :style="canvasStyle"
              @drop="handleDrop"
              @dragover.prevent
              @click="clearSelection"
            >
              <!-- 网格背景 -->
              <div class="grid-background" v-if="showGrid"></div>

              <!-- 设计元素 -->
              <div
                v-for="(element, index) in designElements"
                :key="element.id"
                class="design-element"
                :class="{ selected: selectedElement?.id === element.id }"
                :style="getElementStyle(element)"
                @click.stop="selectElement(element)"
                @mousedown="startDrag(element, $event)"
              >
                <!-- 文本元素 -->
                <div v-if="element.type === 'text'" class="text-element">
                  {{ element.content || "文本内容" }}
                </div>

                <!-- 图片元素 -->
                <div v-if="element.type === 'image'" class="image-element">
                  <img v-if="element.src" :src="element.src" alt="图片" />
                  <div v-else class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                    <span>图片</span>
                  </div>
                </div>

                <!-- 线条元素 -->
                <div v-if="element.type === 'line'" class="line-element">
                  <div
                    class="line-content"
                    :style="getLineStyle(element)"
                  ></div>
                </div>

                <!-- 矩形元素 -->
                <div
                  v-if="element.type === 'rectangle'"
                  class="rectangle-element"
                >
                  <div
                    class="rectangle-content"
                    :style="getRectangleStyle(element)"
                  ></div>
                </div>

                <!-- 条形码元素 -->
                <div v-if="element.type === 'barcode'" class="barcode-element">
                  <img
                    v-if="element.barcodeImage"
                    :src="element.barcodeImage"
                    alt="条形码"
                  />
                  <div v-else class="barcode-placeholder">
                    <el-icon><Postcard /></el-icon>
                    <span>条形码</span>
                  </div>
                </div>

                <!-- 二维码元素 -->
                <div v-if="element.type === 'qrcode'" class="qrcode-element">
                  <img
                    v-if="element.qrcodeImage"
                    :src="element.qrcodeImage"
                    alt="二维码"
                  />
                  <div v-else class="qrcode-placeholder">
                    <el-icon><Grid /></el-icon>
                    <span>二维码</span>
                  </div>
                </div>

                <!-- 表格元素 -->
                <div v-if="element.type === 'table'" class="table-element">
                  <table class="design-table">
                    <tr v-for="row in element.rows" :key="row">
                      <td v-for="col in element.cols" :key="col">单元格</td>
                    </tr>
                  </table>
                </div>

                <!-- 选中时的调整手柄 -->
                <div
                  v-if="selectedElement?.id === element.id"
                  class="resize-handles"
                >
                  <div
                    class="resize-handle nw"
                    @mousedown.stop="startResize(element, 'nw', $event)"
                  ></div>
                  <div
                    class="resize-handle ne"
                    @mousedown.stop="startResize(element, 'ne', $event)"
                  ></div>
                  <div
                    class="resize-handle sw"
                    @mousedown.stop="startResize(element, 'sw', $event)"
                  ></div>
                  <div
                    class="resize-handle se"
                    @mousedown.stop="startResize(element, 'se', $event)"
                  ></div>
                </div>
              </div>
            </div>

            <!-- 标尺 -->
            <div class="rulers" v-if="showRulers">
              <div class="ruler ruler-horizontal"></div>
              <div class="ruler ruler-vertical"></div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧属性面板 -->
      <el-col :span="8">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <span>属性面板</span>
            </div>
          </template>

          <div class="property-panel">
            <!-- 画布设置 -->
            <div class="property-section">
              <h4>画布设置</h4>
              <el-form label-width="80px" size="small">
                <el-form-item label="画布宽度">
                  <el-input-number
                    v-model="canvasWidth"
                    :min="100"
                    :max="1000"
                  />
                </el-form-item>

                <el-form-item label="画布高度">
                  <el-input-number
                    v-model="canvasHeight"
                    :min="100"
                    :max="1000"
                  />
                </el-form-item>

                <el-form-item label="显示网格">
                  <el-switch v-model="showGrid" />
                </el-form-item>

                <el-form-item label="显示标尺">
                  <el-switch v-model="showRulers" />
                </el-form-item>

                <el-form-item label="纸张类型">
                  <el-select v-model="paperType" @change="changePaperType">
                    <el-option label="A4" value="A4" />
                    <el-option label="A3" value="A3" />
                    <el-option label="A5" value="A5" />
                    <el-option label="自定义" value="custom" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>

            <!-- 元素属性 -->
            <div class="property-section" v-if="selectedElement">
              <h4>元素属性</h4>

              <!-- 通用属性 -->
              <el-form label-width="80px" size="small">
                <el-form-item label="X坐标">
                  <el-input-number
                    v-model="selectedElement.x"
                    :min="0"
                    :max="canvasWidth"
                  />
                </el-form-item>

                <el-form-item label="Y坐标">
                  <el-input-number
                    v-model="selectedElement.y"
                    :min="0"
                    :max="canvasHeight"
                  />
                </el-form-item>

                <el-form-item label="宽度">
                  <el-input-number
                    v-model="selectedElement.width"
                    :min="1"
                    :max="canvasWidth"
                  />
                </el-form-item>

                <el-form-item label="高度">
                  <el-input-number
                    v-model="selectedElement.height"
                    :min="1"
                    :max="canvasHeight"
                  />
                </el-form-item>

                <el-form-item label="层级">
                  <el-input-number
                    v-model="selectedElement.zIndex"
                    :min="0"
                    :max="100"
                  />
                </el-form-item>
              </el-form>

              <!-- 文本属性 -->
              <div v-if="selectedElement.type === 'text'">
                <el-form label-width="80px" size="small">
                  <el-form-item label="内容">
                    <el-input v-model="selectedElement.content" />
                  </el-form-item>

                  <el-form-item label="字体大小">
                    <el-input-number
                      v-model="selectedElement.fontSize"
                      :min="8"
                      :max="72"
                    />
                  </el-form-item>

                  <el-form-item label="字体颜色">
                    <el-color-picker v-model="selectedElement.color" />
                  </el-form-item>

                  <el-form-item label="字体粗细">
                    <el-select v-model="selectedElement.fontWeight">
                      <el-option label="正常" value="normal" />
                      <el-option label="粗体" value="bold" />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="对齐方式">
                    <el-select v-model="selectedElement.textAlign">
                      <el-option label="左对齐" value="left" />
                      <el-option label="居中" value="center" />
                      <el-option label="右对齐" value="right" />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="数据字段">
                    <el-input
                      v-model="selectedElement.field"
                      placeholder="如：name, age"
                    />
                  </el-form-item>
                </el-form>
              </div>

              <!-- 图片属性 -->
              <div v-if="selectedElement.type === 'image'">
                <el-form label-width="80px" size="small">
                  <el-form-item label="图片源">
                    <el-input v-model="selectedElement.src" />
                  </el-form-item>

                  <el-form-item label="上传图片">
                    <el-upload
                      :show-file-list="false"
                      :on-change="handleImageUpload"
                      :auto-upload="false"
                    >
                      <el-button size="small">选择图片</el-button>
                    </el-upload>
                  </el-form-item>

                  <el-form-item label="适应方式">
                    <el-select v-model="selectedElement.objectFit">
                      <el-option label="填充" value="fill" />
                      <el-option label="包含" value="contain" />
                      <el-option label="覆盖" value="cover" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 线条属性 -->
              <div v-if="selectedElement.type === 'line'">
                <el-form label-width="80px" size="small">
                  <el-form-item label="线条颜色">
                    <el-color-picker v-model="selectedElement.borderColor" />
                  </el-form-item>

                  <el-form-item label="线条宽度">
                    <el-input-number
                      v-model="selectedElement.borderWidth"
                      :min="1"
                      :max="10"
                    />
                  </el-form-item>

                  <el-form-item label="线条样式">
                    <el-select v-model="selectedElement.borderStyle">
                      <el-option label="实线" value="solid" />
                      <el-option label="虚线" value="dashed" />
                      <el-option label="点线" value="dotted" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 矩形属性 -->
              <div v-if="selectedElement.type === 'rectangle'">
                <el-form label-width="80px" size="small">
                  <el-form-item label="边框颜色">
                    <el-color-picker v-model="selectedElement.borderColor" />
                  </el-form-item>

                  <el-form-item label="边框宽度">
                    <el-input-number
                      v-model="selectedElement.borderWidth"
                      :min="0"
                      :max="10"
                    />
                  </el-form-item>

                  <el-form-item label="边框样式">
                    <el-select v-model="selectedElement.borderStyle">
                      <el-option label="实线" value="solid" />
                      <el-option label="虚线" value="dashed" />
                      <el-option label="点线" value="dotted" />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="填充颜色">
                    <el-color-picker
                      v-model="selectedElement.backgroundColor"
                    />
                  </el-form-item>
                </el-form>
              </div>

              <!-- 条形码属性 -->
              <div v-if="selectedElement.type === 'barcode'">
                <el-form label-width="80px" size="small">
                  <el-form-item label="内容">
                    <el-input
                      v-model="selectedElement.content"
                      @input="updateBarcode"
                    />
                  </el-form-item>

                  <el-form-item label="数据字段">
                    <el-input
                      v-model="selectedElement.field"
                      placeholder="如：barcodeText"
                    />
                  </el-form-item>

                  <el-form-item label="格式">
                    <el-select
                      v-model="selectedElement.format"
                      @change="updateBarcode"
                    >
                      <el-option
                        v-for="format in barcodeFormats"
                        :key="format.value"
                        :label="format.label"
                        :value="format.value"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="显示文本">
                    <el-switch
                      v-model="selectedElement.showText"
                      @change="updateBarcode"
                    />
                  </el-form-item>
                </el-form>
              </div>

              <!-- 二维码属性 -->
              <div v-if="selectedElement.type === 'qrcode'">
                <el-form label-width="80px" size="small">
                  <el-form-item label="内容">
                    <el-input
                      v-model="selectedElement.content"
                      type="textarea"
                      @input="updateQRCode"
                    />
                  </el-form-item>

                  <el-form-item label="数据字段">
                    <el-input
                      v-model="selectedElement.field"
                      placeholder="如：qrcodeText"
                    />
                  </el-form-item>

                  <el-form-item label="纠错等级">
                    <el-select
                      v-model="selectedElement.errorLevel"
                      @change="updateQRCode"
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
              </div>

              <!-- 表格属性 -->
              <div v-if="selectedElement.type === 'table'">
                <el-form label-width="80px" size="small">
                  <el-form-item label="行数">
                    <el-input-number
                      v-model="selectedElement.rows"
                      :min="1"
                      :max="20"
                    />
                  </el-form-item>

                  <el-form-item label="列数">
                    <el-input-number
                      v-model="selectedElement.cols"
                      :min="1"
                      :max="10"
                    />
                  </el-form-item>

                  <el-form-item label="边框颜色">
                    <el-color-picker v-model="selectedElement.borderColor" />
                  </el-form-item>

                  <el-form-item label="边框宽度">
                    <el-input-number
                      v-model="selectedElement.borderWidth"
                      :min="0"
                      :max="5"
                    />
                  </el-form-item>
                </el-form>
              </div>

              <!-- 操作按钮 -->
              <div class="element-actions">
                <el-button size="small" @click="copyElement">复制</el-button>
                <el-button size="small" @click="deleteElement" type="danger"
                  >删除</el-button
                >
                <el-button size="small" @click="bringToFront">置顶</el-button>
                <el-button size="small" @click="sendToBack">置底</el-button>
              </div>
            </div>

            <!-- 模板操作 -->
            <div class="property-section">
              <h4>模板操作</h4>
              <div class="template-actions">
                <el-button size="small" @click="saveTemplate" type="primary"
                  >保存模板</el-button
                >
                <el-button size="small" @click="loadTemplate"
                  >加载模板</el-button
                >
                <el-button size="small" @click="exportTemplate"
                  >导出模板</el-button
                >
                <el-button size="small" @click="importTemplate"
                  >导入模板</el-button
                >
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Edit, Picture, Minus, Grid, Postcard } from "@element-plus/icons-vue";
import { printService } from "../services/printService";
import { codeService } from "../services/codeService";

export default {
  name: "DragDesignDemo",
  components: {
    Edit,
    Picture,
    Minus,
    Grid,
    Postcard,
  },
  data() {
    return {
      // 画布设置
      canvasWidth: 210,
      canvasHeight: 297,
      showGrid: true,
      showRulers: true,
      paperType: "A4",

      // 设计元素
      designElements: [],
      selectedElement: null,
      nextElementId: 1,

      // 拖拽状态
      isDragging: false,
      isResizing: false,
      dragStartX: 0,
      dragStartY: 0,
      resizeDirection: null,

      // 选项数据
      barcodeFormats: [],
      qrErrorLevels: [],

      // 打印模板
      hiprintTemplate: null,
    };
  },

  computed: {
    canvasStyle() {
      return {
        width: `${this.canvasWidth}mm`,
        height: `${this.canvasHeight}mm`,
        transform: "scale(1)",
        transformOrigin: "top left",
      };
    },
  },

  mounted() {
    this.initOptions();
    this.addEventListeners();
  },

  beforeUnmount() {
    this.removeEventListeners();
  },

  methods: {
    // 初始化选项
    initOptions() {
      this.barcodeFormats = codeService.getSupportedBarcodeFormats();
      this.qrErrorLevels = codeService.getQRCodeErrorLevels();
    },

    // 添加事件监听
    addEventListeners() {
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);
      document.addEventListener("keydown", this.handleKeyDown);
    },

    // 移除事件监听
    removeEventListeners() {
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
      document.removeEventListener("keydown", this.handleKeyDown);
    },

    // 开始拖拽
    handleDragStart(event, elementType) {
      event.dataTransfer.setData("text/plain", elementType);
    },

    // 处理放置
    handleDrop(event) {
      event.preventDefault();
      const elementType = event.dataTransfer.getData("text/plain");
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.createElement(elementType, x, y);
    },

    // 创建元素
    createElement(type, x, y) {
      const element = {
        id: this.nextElementId++,
        type,
        x: Math.max(0, Math.min(x, this.canvasWidth - 50)),
        y: Math.max(0, Math.min(y, this.canvasHeight - 30)),
        width: this.getDefaultWidth(type),
        height: this.getDefaultHeight(type),
        zIndex: this.designElements.length,
        ...this.getDefaultProperties(type),
      };

      this.designElements.push(element);
      this.selectElement(element);
    },

    // 获取默认宽度
    getDefaultWidth(type) {
      const defaults = {
        text: 80,
        image: 80,
        line: 100,
        rectangle: 80,
        barcode: 120,
        qrcode: 60,
        table: 120,
      };
      return defaults[type] || 80;
    },

    // 获取默认高度
    getDefaultHeight(type) {
      const defaults = {
        text: 20,
        image: 60,
        line: 2,
        rectangle: 60,
        barcode: 40,
        qrcode: 60,
        table: 80,
      };
      return defaults[type] || 20;
    },

    // 获取默认属性
    getDefaultProperties(type) {
      const defaults = {
        text: {
          content: "文本内容",
          fontSize: 14,
          color: "#000000",
          fontWeight: "normal",
          textAlign: "left",
          field: "",
        },
        image: {
          src: "",
          objectFit: "contain",
        },
        line: {
          borderColor: "#000000",
          borderWidth: 1,
          borderStyle: "solid",
        },
        rectangle: {
          borderColor: "#000000",
          borderWidth: 1,
          borderStyle: "solid",
          backgroundColor: "transparent",
        },
        barcode: {
          content: "123456789",
          field: "barcodeText",
          format: "CODE128",
          showText: true,
          barcodeImage: null,
        },
        qrcode: {
          content: "https://example.com",
          field: "qrcodeText",
          errorLevel: "M",
          qrcodeImage: null,
        },
        table: {
          rows: 3,
          cols: 3,
          borderColor: "#000000",
          borderWidth: 1,
        },
      };
      return defaults[type] || {};
    },

    // 获取元素样式
    getElementStyle(element) {
      return {
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex,
        fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
        color: element.color,
        fontWeight: element.fontWeight,
        textAlign: element.textAlign,
        borderColor: element.borderColor,
        borderWidth: element.borderWidth
          ? `${element.borderWidth}px`
          : undefined,
        borderStyle: element.borderStyle,
        backgroundColor: element.backgroundColor,
      };
    },

    // 获取线条样式
    getLineStyle(element) {
      return {
        width: "100%",
        height: `${element.borderWidth}px`,
        backgroundColor: element.borderColor,
        borderStyle: element.borderStyle,
      };
    },

    // 获取矩形样式
    getRectangleStyle(element) {
      return {
        width: "100%",
        height: "100%",
        border: `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`,
        backgroundColor: element.backgroundColor,
      };
    },

    // 选择元素
    selectElement(element) {
      this.selectedElement = element;
    },

    // 清除选择
    clearSelection() {
      this.selectedElement = null;
    },

    // 开始拖拽元素
    startDrag(element, event) {
      if (this.isResizing) return;

      this.isDragging = true;
      this.dragStartX = event.clientX - element.x;
      this.dragStartY = event.clientY - element.y;
      this.selectElement(element);
    },

    // 开始调整大小
    startResize(element, direction, event) {
      event.stopPropagation();
      this.isResizing = true;
      this.resizeDirection = direction;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.selectElement(element);
    },

    // 鼠标移动处理
    handleMouseMove(event) {
      if (this.isDragging && this.selectedElement) {
        const newX = event.clientX - this.dragStartX;
        const newY = event.clientY - this.dragStartY;

        this.selectedElement.x = Math.max(
          0,
          Math.min(newX, this.canvasWidth - this.selectedElement.width)
        );
        this.selectedElement.y = Math.max(
          0,
          Math.min(newY, this.canvasHeight - this.selectedElement.height)
        );
      }

      if (this.isResizing && this.selectedElement) {
        const deltaX = event.clientX - this.dragStartX;
        const deltaY = event.clientY - this.dragStartY;

        this.handleResize(deltaX, deltaY);
      }
    },

    // 处理调整大小
    handleResize(deltaX, deltaY) {
      const element = this.selectedElement;

      switch (this.resizeDirection) {
        case "se":
          element.width = Math.max(10, element.width + deltaX);
          element.height = Math.max(10, element.height + deltaY);
          break;
        case "sw":
          element.width = Math.max(10, element.width - deltaX);
          element.height = Math.max(10, element.height + deltaY);
          element.x = Math.max(0, element.x + deltaX);
          break;
        case "ne":
          element.width = Math.max(10, element.width + deltaX);
          element.height = Math.max(10, element.height - deltaY);
          element.y = Math.max(0, element.y + deltaY);
          break;
        case "nw":
          element.width = Math.max(10, element.width - deltaX);
          element.height = Math.max(10, element.height - deltaY);
          element.x = Math.max(0, element.x + deltaX);
          element.y = Math.max(0, element.y + deltaY);
          break;
      }

      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    },

    // 鼠标松开处理
    handleMouseUp() {
      this.isDragging = false;
      this.isResizing = false;
      this.resizeDirection = null;
    },

    // 键盘事件处理
    handleKeyDown(event) {
      if (event.key === "Delete" && this.selectedElement) {
        this.deleteElement();
      }

      if (event.key === "Escape") {
        this.clearSelection();
      }
    },

    // 复制元素
    copyElement() {
      if (this.selectedElement) {
        const newElement = {
          ...this.selectedElement,
          id: this.nextElementId++,
          x: this.selectedElement.x + 10,
          y: this.selectedElement.y + 10,
          zIndex: this.designElements.length,
        };
        this.designElements.push(newElement);
        this.selectElement(newElement);
      }
    },

    // 删除元素
    deleteElement() {
      if (this.selectedElement) {
        const index = this.designElements.findIndex(
          (el) => el.id === this.selectedElement.id
        );
        if (index > -1) {
          this.designElements.splice(index, 1);
          this.selectedElement = null;
        }
      }
    },

    // 置顶
    bringToFront() {
      if (this.selectedElement) {
        this.selectedElement.zIndex =
          Math.max(...this.designElements.map((el) => el.zIndex)) + 1;
      }
    },

    // 置底
    sendToBack() {
      if (this.selectedElement) {
        this.selectedElement.zIndex =
          Math.min(...this.designElements.map((el) => el.zIndex)) - 1;
      }
    },

    // 更新条形码
    async updateBarcode() {
      if (this.selectedElement && this.selectedElement.type === "barcode") {
        try {
          this.selectedElement.barcodeImage = await codeService.generateBarcode(
            this.selectedElement.content,
            {
              format: this.selectedElement.format,
              width: 1,
              height: 50,
              displayValue: this.selectedElement.showText,
            }
          );
        } catch (error) {
          console.error("生成条形码失败:", error);
        }
      }
    },

    // 更新二维码
    async updateQRCode() {
      if (this.selectedElement && this.selectedElement.type === "qrcode") {
        try {
          this.selectedElement.qrcodeImage = await codeService.generateQRCode(
            this.selectedElement.content,
            {
              width: 200,
              errorCorrectionLevel: this.selectedElement.errorLevel,
            }
          );
        } catch (error) {
          console.error("生成二维码失败:", error);
        }
      }
    },

    // 处理图片上传
    handleImageUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.selectedElement && this.selectedElement.type === "image") {
          this.selectedElement.src = e.target.result;
        }
      };
      reader.readAsDataURL(file.raw);
    },

    // 改变纸张类型
    changePaperType() {
      const sizes = {
        A4: { width: 210, height: 297 },
        A3: { width: 297, height: 420 },
        A5: { width: 148, height: 210 },
      };

      if (sizes[this.paperType]) {
        this.canvasWidth = sizes[this.paperType].width;
        this.canvasHeight = sizes[this.paperType].height;
      }
    },

    // 清空设计
    clearDesign() {
      this.$confirm("确定要清空设计吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.designElements = [];
        this.selectedElement = null;
        this.$message.success("设计已清空");
      });
    },

    // 预览设计
    async previewDesign() {
      if (this.designElements.length === 0) {
        this.$message.warning("请先添加设计元素");
        return;
      }

      try {
        const template = await this.generateHiprintTemplate();
        const sampleData = this.generateSampleData();

        template.preview(sampleData);
        this.$message.success("预览成功");
      } catch (error) {
        console.error("预览失败:", error);
        this.$message.error("预览失败: " + error.message);
      }
    },

    // 打印设计
    async printDesign() {
      if (this.designElements.length === 0) {
        this.$message.warning("请先添加设计元素");
        return;
      }

      try {
        const template = await this.generateHiprintTemplate();
        const sampleData = this.generateSampleData();

        template.print(
          sampleData,
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

    // 生成hiprint模板
    async generateHiprintTemplate() {
      const printElements = [];

      for (const element of this.designElements) {
        const printElement = await this.convertToHiprintElement(element);
        if (printElement) {
          printElements.push(printElement);
        }
      }

      const template = {
        panels: [
          {
            index: 0,
            height: this.canvasHeight,
            width: this.canvasWidth,
            paperHeader: 5,
            paperFooter: 5,
            printElements,
          },
        ],
      };

      return printService.createTemplate({ template });
    },

    // 转换为hiprint元素
    async convertToHiprintElement(element) {
      const baseOptions = {
        left: element.x,
        top: element.y,
        height: element.height,
        width: element.width,
      };

      switch (element.type) {
        case "text":
          return {
            options: {
              ...baseOptions,
              title: element.content,
              field: element.field,
              fontSize: element.fontSize,
              color: element.color,
              fontWeight: element.fontWeight,
              textAlign: element.textAlign,
            },
            printElementType: {
              title: "文本",
              type: "text",
            },
          };

        case "image":
          return {
            options: {
              ...baseOptions,
              src: element.src,
              field: element.field,
            },
            printElementType: {
              title: "图片",
              type: "image",
            },
          };

        case "line":
          return {
            options: {
              ...baseOptions,
              borderColor: element.borderColor,
              borderWidth: element.borderWidth,
              borderStyle: element.borderStyle,
            },
            printElementType: {
              title: "线条",
              type: "hline",
            },
          };

        case "rectangle":
          return {
            options: {
              ...baseOptions,
              borderColor: element.borderColor,
              borderWidth: element.borderWidth,
              borderStyle: element.borderStyle,
              backgroundColor: element.backgroundColor,
            },
            printElementType: {
              title: "矩形",
              type: "rect",
            },
          };

        case "barcode":
          return {
            options: {
              ...baseOptions,
              field: element.field || "barcodeImage",
              barcodeType: element.format,
            },
            printElementType: {
              title: "条形码",
              type: "image",
            },
          };

        case "qrcode":
          return {
            options: {
              ...baseOptions,
              field: element.field || "qrcodeImage",
            },
            printElementType: {
              title: "二维码",
              type: "image",
            },
          };

        case "table":
          return {
            options: {
              ...baseOptions,
              borderColor: element.borderColor,
              borderWidth: element.borderWidth,
              rows: element.rows,
              cols: element.cols,
            },
            printElementType: {
              title: "表格",
              type: "table",
            },
          };
      }

      return null;
    },

    // 生成示例数据
    generateSampleData() {
      const data = {
        name: "张三",
        age: 28,
        department: "技术部",
        position: "前端工程师",
        salary: "12000",
        barcodeText: "EMP001",
        qrcodeText: "员工编号：EMP001\n姓名：张三\n部门：技术部",
      };

      // 为条形码和二维码元素生成图片
      this.designElements.forEach(async (element) => {
        if (element.type === "barcode" && element.barcodeImage) {
          data.barcodeImage = element.barcodeImage;
        } else if (element.type === "qrcode" && element.qrcodeImage) {
          data.qrcodeImage = element.qrcodeImage;
        }
      });

      return data;
    },

    // 保存模板
    saveTemplate() {
      const template = {
        name: `模板_${new Date().toLocaleString()}`,
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight,
        paperType: this.paperType,
        elements: this.designElements,
      };

      const templateStr = JSON.stringify(template, null, 2);
      localStorage.setItem("designTemplate", templateStr);

      this.$message.success("模板保存成功");
    },

    // 加载模板
    loadTemplate() {
      const templateStr = localStorage.getItem("designTemplate");
      if (templateStr) {
        try {
          const template = JSON.parse(templateStr);
          this.canvasWidth = template.canvasWidth;
          this.canvasHeight = template.canvasHeight;
          this.paperType = template.paperType;
          this.designElements = template.elements;
          this.selectedElement = null;
          this.nextElementId =
            Math.max(...this.designElements.map((el) => el.id)) + 1;

          this.$message.success("模板加载成功");
        } catch (error) {
          this.$message.error("模板格式错误");
        }
      } else {
        this.$message.warning("没有找到保存的模板");
      }
    },

    // 导出模板
    exportTemplate() {
      const template = {
        name: `模板_${new Date().toLocaleString()}`,
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight,
        paperType: this.paperType,
        elements: this.designElements,
      };

      const templateStr = JSON.stringify(template, null, 2);
      const blob = new Blob([templateStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `design_template_${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      this.$message.success("模板导出成功");
    },

    // 导入模板
    importTemplate() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const template = JSON.parse(e.target.result);
              this.canvasWidth = template.canvasWidth;
              this.canvasHeight = template.canvasHeight;
              this.paperType = template.paperType;
              this.designElements = template.elements;
              this.selectedElement = null;
              this.nextElementId =
                Math.max(...this.designElements.map((el) => el.id)) + 1;

              this.$message.success("模板导入成功");
            } catch (error) {
              this.$message.error("模板格式错误");
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    },
  },
};
</script>

<style scoped>
.drag-design-demo {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 元素工具栏 */
.element-toolbar {
  padding: 10px;
}

.element-toolbar h4 {
  margin: 15px 0 10px 0;
  font-size: 14px;
  color: #666;
}

.element-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.element-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s;
}

.element-item:hover {
  background-color: #f5f5f5;
  border-color: #409eff;
}

.element-item:active {
  cursor: grabbing;
}

.element-item span {
  font-size: 12px;
  color: #666;
}

/* 设计容器 */
.design-container {
  position: relative;
  overflow: auto;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
}

/* 设计画布 */
.design-canvas {
  position: relative;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
  cursor: crosshair;
}

/* 网格背景 */
.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, #f0f0f0 1px, transparent 1px),
    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
  background-size: 10px 10px;
  pointer-events: none;
}

/* 设计元素 */
.design-element {
  position: absolute;
  cursor: move;
  border: 1px solid transparent;
  outline: none;
}

.design-element.selected {
  border-color: #409eff;
  box-shadow: 0 0 0 1px #409eff;
}

.design-element:hover {
  border-color: #409eff;
}

/* 调整大小手柄 */
.resize-handles {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #409eff;
  border: 1px solid #fff;
  border-radius: 50%;
  pointer-events: all;
}

.resize-handle.nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.resize-handle.ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-handle.sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.resize-handle.se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

/* 元素样式 */
.text-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-element img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
}

.line-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.rectangle-element {
  width: 100%;
  height: 100%;
}

.barcode-element,
.qrcode-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.barcode-element img,
.qrcode-element img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.barcode-placeholder,
.qrcode-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
}

.table-element {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.design-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}

.design-table td {
  border: 1px solid #ddd;
  padding: 2px;
  text-align: center;
  font-size: 12px;
}

/* 属性面板 */
.property-panel {
  padding: 10px;
}

.property-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.property-section h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #666;
}

.element-actions {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}

.template-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-actions .el-button {
  width: 100%;
}

/* 标尺 */
.rulers {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.ruler {
  position: absolute;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
}

.ruler-horizontal {
  top: 0;
  left: 20px;
  right: 20px;
  height: 20px;
}

.ruler-vertical {
  top: 20px;
  left: 0;
  bottom: 20px;
  width: 20px;
}
</style>
