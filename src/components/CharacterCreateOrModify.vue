<template>
  <form @submit.prevent="handleSubmit">
    <!-- 角色信息 -->
    <div class="pb-4">
      <div class="flex items-center gap-3 pb-2">
        <div class="w-1 h-4 bg-primary rounded-full"></div>
        <h3 class="text-lg font-medium text-base-content">基础信息</h3>
      </div>
      <div>
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">角色名称</legend>
          <input v-model="formData.name" type="text" class="input w-full daisy-clean" placeholder="Elara Nightshade" required />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">角色描述</legend>
          <textarea v-model="formData.description" class="textarea w-full h-20 daisy-clean" placeholder="著名的考古学家" required></textarea>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">背景图片</legend>

          <div class="flex gap-3 md:gap-6">
            <!-- 背景图片上传区域 -->
            <div class="flex-1 md:w-40 md:flex-shrink-0">
              <div class="relative border-2 border-dashed border-base-300 rounded-lg bg-base-200 hover:bg-base-300 transition-colors cursor-pointer group" :class="{ 'border-primary': isDragOver }" @click="triggerBackgroundImageUpload" @dragover.prevent="isDragOver = true" @dragleave.prevent="isDragOver = false" @drop.prevent="handleBackgroundImageDrop">
                <input ref="backgroundImageInput" type="file" accept="image/*" class="hidden" @change="handleBackgroundImageChange" />

                <!-- 预览图片 -->
                <div v-if="formData.backgroundImageFile || formData.backgroundImage" class="relative aspect-[3/4] w-full">
                  <img :src="formData.backgroundImage" alt="角色背景图" class="w-full h-full object-cover rounded-lg" />
                  <button type="button" @click.stop="removeBackgroundImage" class="absolute top-1 right-1 md:top-2 md:right-2 btn btn-circle btn-xs md:btn-sm btn-error opacity-80 hover:opacity-100">
                    <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- 上传区域 -->
                <div v-else class="aspect-[3/4] flex flex-col items-center justify-center p-2 md:p-4 text-center">
                  <svg class="w-6 h-6 md:w-10 md:h-10 text-base-content/50 mb-1 md:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <div class="text-xs md:text-sm font-medium text-base-content/70 mb-1">上传图片</div>
                  <div class="text-xs text-base-content/50 hidden md:block">或拖拽图片到此处</div>
                </div>
              </div>
            </div>

            <!-- 上传说明和要求 -->
            <div class="flex-1 space-y-3 md:space-y-4">
              <div>
                <h4 class="text-sm font-semibold text-base-content mb-1 md:mb-2">上传要求</h4>
                <ul class="text-xs md:text-sm text-base-content/70 space-y-1">
                  <li>• 建议上传 9:16 或 3:4 比例的图片</li>
                  <li>• 图片大小不超过 5MB</li>
                  <li>• 支持 JPG、PNG 格式</li>
                </ul>
              </div>

              <div>
                <h4 class="text-sm font-semibold text-error mb-1 md:mb-2">社区规范</h4>
                <p class="text-xs md:text-sm text-base-content/70">为维护社区环境，请不要上传涉及未成年人色情和过分暴露引起他人不适的图像。</p>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>

    <!-- 角色设定 -->
    <div class="pb-4">
      <div class="flex items-center gap-3 pb-2">
        <div class="w-1 h-4 bg-primary rounded-full"></div>
        <h3 class="text-lg font-medium text-base-content">角色设定</h3>
      </div>

      <div>
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">角色人设</legend>
          <textarea v-model="formData.personality" class="textarea w-full h-32 daisy-clean" placeholder="著名的考古学家Elara Nightshade有着神秘的过去，她花费了数十年时间探索世界各地被遗忘的神庙和古代遗迹。她有着标志性的银色条纹黑发和穿透性的琥珀色眼睛，在学术界备受尊重，同时保持着神秘的气质。传说她掌握着违背常理的神秘文物知识..." required></textarea>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">背景信息</legend>
          <textarea v-model="formData.personality" class="textarea w-full h-32 daisy-clean" placeholder="著名的考古学家Elara Nightshade有着神秘的过去，她花费了数十年时间探索世界各地被遗忘的神庙和古代遗迹。她有着标志性的银色条纹黑发和穿透性的琥珀色眼睛，在学术界备受尊敬，同时保持着神秘的气质。传说她掌握着违背常理的神秘文物知识..." required></textarea>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">主要提示词</legend>
          <textarea v-model="formData.mainPrompt" class="textarea w-full h-32 daisy-clean" placeholder="你是一个专业的考古学家，具有丰富的历史知识和探险经验..."></textarea>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">历史后指令</legend>
          <textarea v-model="formData.postHistoryPrompt" class="textarea w-full h-24 daisy-clean" placeholder="根据上述对话历史，请继续保持角色的一致性..."></textarea>
        </fieldset>

        <fieldset class="fieldset border-none">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">可见性</legend>
          <select v-model="formData.visibility" class="select w-full daisy-clean">
            <option value="private">私有：只有你可以聊天</option>
            <option value="unlisted">未列出：任何有链接的人</option>
            <option value="public">公开：任何人都可以聊天</option>
          </select>
        </fieldset>
      </div>
    </div>

    <!-- 对话内容 -->
    <div class="pb-4">
      <div class="flex items-center gap-3 pb-2">
        <div class="w-1 h-4 bg-primary rounded-full"></div>
        <h3 class="text-lg font-medium text-base-content">对话内容</h3>
      </div>

      <div>
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">开场白</legend>
          <textarea v-model="formData.firstMessage" class="textarea w-full h-32 daisy-clean" placeholder="" required></textarea>
        </fieldset>

        <fieldset class="fieldset">
          <!-- 标题和添加按钮 -->
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-base font-medium text-base-content/80">多开场白</h4>
            <button type="button" @click="addGreeting" class="btn btn-sm btn-primary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              添加开场
            </button>
          </div>

          <div v-if="formData.alternateGreetings && formData.alternateGreetings.length > 0" class="space-y-3">
            <div v-for="(_, index) in formData.alternateGreetings" :key="index" class="card bg-base-100 border border-base-300">
              <div class="card-body p-4">
                <div class="flex items-start gap-3">
                  <!-- 序号 -->
                  <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-sm font-medium text-primary">{{ index + 1 }}</span>
                  </div>

                  <!-- 内容区域 -->
                  <div class="flex-1">
                    <textarea v-model="formData.alternateGreetings[index]" class="textarea w-full h-24 daisy-clean" placeholder="输入开场白内容..."></textarea>
                  </div>

                  <!-- 删除按钮 -->
                  <button type="button" @click="removeGreeting(index)" class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset class="fieldset">
          <!-- 标题和添加按钮 -->
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-base font-medium text-base-content/80">对话示例</h4>
            <button type="button" @click="addDialogExample" class="btn btn-sm btn-primary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              添加示例
            </button>
          </div>

          <div v-if="formData.exampleMessages.length > 0" class="space-y-4">
            <div v-for="(example, index) in formData.exampleMessages" :key="'example-' + index" class="card bg-base-100 border border-base-300">
              <div class="card-body p-4">
                <!-- 标题栏 -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span class="text-xs font-medium text-primary">{{ index + 1 }}</span>
                    </div>
                    <span class="text-sm font-medium text-base-content/70">示例 {{ index + 1 }}</span>
                  </div>
                  <button type="button" @click="removeDialogExample(index)" class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <!-- 用户输入 -->
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-sm font-medium text-base-content/70">用户输入</span>
                  </div>
                  <textarea v-model="example.userInput" class="textarea w-full h-20 daisy-clean" placeholder="用户会说什么..."></textarea>
                </div>

                <!-- AI回复 -->
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <span class="text-sm font-medium text-base-content/70">AI回复</span>
                  </div>
                  <textarea v-model="example.aiOutput" class="textarea w-full h-20 daisy-clean" placeholder="AI应该如何回复..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>

    <!-- 高级设置 -->
    <div class="pb-4">
      <div class="pb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-1 h-4 bg-primary rounded-full"></div>
            <h3 class="text-lg font-medium text-base-content">高级设置</h3>
          </div>

          <!-- 高级设置开关 -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-base-content/70">展开</span>
            <BaseToggle v-model="showAdvancedSettings" />
          </div>
        </div>
      </div>

      <div v-if="showAdvancedSettings">
        <!-- 世界书设置 -->
        <fieldset class="fieldset">
          <!-- 标题和添加按钮 -->
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-base font-medium text-base-content/80">世界书</h4>
            <button type="button" @click="addWorldInfo" class="btn btn-sm btn-primary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              添加世界书
            </button>
          </div>

          <div class="space-y-4">
            <div v-if="formData.worldInfos.length > 0" class="space-y-3">
              <!-- 世界书条目列表 -->
              <div v-for="(worldInfo, index) in formData.worldInfos" :key="'worldinfo-' + index" class="card bg-base-100 border border-base-300">
                <!-- 桌面模式 -->
                <div class="hidden lg:block card-body p-4">
                  <div class="flex items-center gap-3">
                    <!-- 展开按钮 -->
                    <button type="button" @click="toggleWorldInfoExpand(index)" class="btn btn-ghost btn-sm btn-circle">
                      <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-90': worldInfo.expanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <!-- 开关 -->
                    <BaseToggle :modelValue="worldInfo.status === 'ENABLE'" @update:modelValue="worldInfo.status = $event ? 'ENABLE' : 'DISABLE'" size="sm" />

                    <!-- 名称显示 -->
                    <div class="flex-1">
                      <span class="text-sm font-medium text-base-content">{{ worldInfo.name || '未命名世界书' }}</span>
                    </div>

                    <!-- 删除按钮 -->
                    <button type="button" @click="removeWorldInfo(index)" class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <!-- 展开的详细编辑区域 -->
                  <div v-if="worldInfo.expanded" class="mt-4 pt-4 border-t border-base-300 space-y-3">
                    <!-- 名称编辑 -->
                    <div>
                      <label class="label label-text text-sm">名称</label>
                      <input v-model="worldInfo.name" type="text" class="input input-sm w-full daisy-clean" placeholder="世界书名称" />
                    </div>

                    <!-- 位置和触发方式 -->
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="label label-text text-sm">位置</label>
                        <select v-model="worldInfo.position" class="select select-sm w-full daisy-clean">
                          <option value="BEFORE_CHARACTER">角色定义前</option>
                          <option value="AFTER_CHARACTER">角色定义后</option>
                          <option value="BEFORE_FLOAT">浮动描述前</option>
                          <option value="AFTER_FLOAT">浮动描述后</option>
                          <option value="BEFORE_EXAMPLE">示例对话前</option>
                          <option value="AFTER_EXAMPLE">示例对话后</option>
                          <option value="SYSTEM_CHAT_DEPTH">系统对话深度</option>
                          <option value="USER_CHAT_DEPTH">用户对话深度</option>
                          <option value="AI_CHAT_DEPTH">AI对话深度</option>
                        </select>
                      </div>
                      <div>
                        <label class="label label-text text-sm">触发方式</label>
                        <select :value="worldInfo.skipKeyMatch ? 'always' : 'match'" @change="handleTriggerModeChange(index, $event.target.value)" class="select select-sm w-full daisy-clean">
                          <option value="always">始终生效</option>
                          <option value="match">匹配生效</option>
                        </select>
                      </div>
                    </div>

                    <!-- 深度和顺序 -->
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="label label-text text-sm">深度</label>
                        <input v-model.number="worldInfo.depth" type="number" class="input input-sm w-full daisy-clean text-center" min="0" max="999" />
                      </div>
                      <div>
                        <label class="label label-text text-sm">顺序</label>
                        <input v-model.number="worldInfo.order" type="number" class="input input-sm w-full daisy-clean text-center" min="0" max="9999" />
                      </div>
                    </div>

                    <!-- 递归选项 -->
                    <div class="grid grid-cols-2 gap-3">
                      <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <label class="label-text text-sm font-medium">递归</label>
                        <BaseToggle v-model="worldInfo.recursive" size="sm" />
                      </div>
                      <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <label class="label-text text-sm font-medium">防止递归</label>
                        <BaseToggle v-model="worldInfo.preventRecursion" size="sm" />
                      </div>
                    </div>

                    <!-- 匹配规则 -->
                    <div v-show="worldInfo.skipKeyMatch === false">
                      <label class="label label-text text-sm">匹配规则</label>
                      <div class="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                        <!-- 主匹配词 -->
                        <input
                          :value="getMatchKeysString(worldInfo.keys)"
                          @input="e => updateMatchKeys(index, e.target.value, 'keys')"
                          type="text"
                          class="input input-sm w-full daisy-clean"
                          placeholder="主匹配词（逗号分隔）"
                        />

                        <!-- 逻辑关系 -->
                        <select v-model="worldInfo.keyMatchRelation" class="select select-sm w-24 daisy-clean">
                          <option value="AND_ANY">与任意</option>
                          <option value="AND_ALL">与所有</option>
                          <option value="NOT_ANY">非所有</option>
                          <option value="NOT_ALL">非任何</option>
                        </select>

                        <!-- 副匹配词 -->
                        <input
                          :value="getMatchKeysString(worldInfo.secondaryKeys)"
                          @input="e => updateMatchKeys(index, e.target.value, 'secondaryKeys')"
                          type="text"
                          class="input input-sm w-full daisy-clean"
                          placeholder="副匹配词（逗号分隔）"
                        />
                      </div>
                    </div>

                    <!-- 内容编辑 -->
                    <div>
                      <label class="label label-text text-sm">内容</label>
                      <textarea v-model="worldInfo.content" class="textarea w-full h-32 daisy-clean" placeholder="世界书的具体内容..."></textarea>
                    </div>
                  </div>
                </div>

                <!-- 手机模式 -->
                <div class="lg:hidden card-body p-3">
                  <div class="flex items-center gap-3">
                    <!-- 展开按钮 -->
                    <button type="button" @click="toggleWorldInfoExpand(index)" class="btn btn-ghost btn-sm btn-circle">
                      <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-90': worldInfo.expanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <!-- 开关 -->
                    <BaseToggle :modelValue="worldInfo.status === 'ENABLE'" @update:modelValue="worldInfo.status = $event ? 'ENABLE' : 'DISABLE'" size="sm" />

                    <!-- 名称显示 -->
                    <div class="flex-1">
                      <span class="text-sm font-medium text-base-content">{{ worldInfo.name || '未命名世界书' }}</span>
                    </div>

                    <!-- 删除按钮 -->
                    <button type="button" @click="removeWorldInfo(index)" class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <!-- 展开的详细编辑区域 -->
                  <div v-if="worldInfo.expanded" class="mt-3 pt-3 border-t border-base-300 space-y-3">
                    <!-- 名称编辑 -->
                    <div>
                      <label class="label label-text text-xs">名称</label>
                      <input v-model="worldInfo.name" type="text" class="input input-sm w-full daisy-clean" placeholder="世界书名称" />
                    </div>

                    <!-- 位置和触发方式 -->
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="label label-text text-xs">位置</label>
                        <select v-model="worldInfo.position" class="select select-sm w-full daisy-clean">
                          <option value="BEFORE_CHARACTER">角色定义前</option>
                          <option value="AFTER_CHARACTER">角色定义后</option>
                          <option value="BEFORE_FLOAT">浮动描述前</option>
                          <option value="AFTER_FLOAT">浮动描述后</option>
                          <option value="BEFORE_EXAMPLE">示例对话前</option>
                          <option value="AFTER_EXAMPLE">示例对话后</option>
                          <option value="SYSTEM_CHAT_DEPTH">系统对话深度</option>
                          <option value="USER_CHAT_DEPTH">用户对话深度</option>
                          <option value="AI_CHAT_DEPTH">AI对话深度</option>
                        </select>
                      </div>
                      <div>
                        <label class="label label-text text-xs">触发方式</label>
                        <select :value="worldInfo.skipKeyMatch ? 'always' : 'match'" @change="handleTriggerModeChange(index, $event.target.value)" class="select select-sm w-full daisy-clean">
                          <option value="always">始终生效</option>
                          <option value="match">匹配生效</option>
                        </select>
                      </div>
                    </div>

                    <!-- 深度和顺序 -->
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="label label-text text-xs">深度</label>
                        <input v-model.number="worldInfo.depth" type="number" class="input input-sm w-full daisy-clean text-center" min="0" max="999" />
                      </div>
                      <div>
                        <label class="label label-text text-xs">顺序</label>
                        <input v-model.number="worldInfo.order" type="number" class="input input-sm w-full daisy-clean text-center" min="0" max="9999" />
                      </div>
                    </div>

                    <!-- 递归选项 -->
                    <div class="grid grid-cols-2 gap-2">
                      <div class="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                        <label class="label-text text-xs font-medium">递归</label>
                        <BaseToggle v-model="worldInfo.recursive" size="sm" />
                      </div>
                      <div class="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                        <label class="label-text text-xs font-medium">防止递归</label>
                        <BaseToggle v-model="worldInfo.preventRecursion" size="sm" />
                      </div>
                    </div>

                    <!-- 匹配规则 -->
                    <div v-show="worldInfo.skipKeyMatch === false" class="space-y-2">
                      <!-- 主匹配词 -->
                      <div>
                        <label class="label label-text text-xs">主匹配词</label>
                        <input
                          :value="getMatchKeysString(worldInfo.keys)"
                          @input="e => updateMatchKeys(index, e.target.value, 'keys')"
                          type="text"
                          class="input input-sm w-full daisy-clean"
                          placeholder="逗号分隔列表（如果为空,则不限定）"
                        />
                      </div>

                      <!-- 逻辑关系 -->
                      <div>
                        <label class="label label-text text-xs">匹配关系</label>
                        <select v-model="worldInfo.keyMatchRelation" class="select select-sm w-full daisy-clean">
                          <option value="AND_ANY">与任意</option>
                          <option value="AND_ALL">与所有</option>
                          <option value="NOT_ANY">非所有</option>
                          <option value="NOT_ALL">非任何</option>
                        </select>
                      </div>

                      <!-- 副匹配词 -->
                      <div>
                        <label class="label label-text text-xs">副匹配词</label>
                        <input
                          :value="getMatchKeysString(worldInfo.secondaryKeys)"
                          @input="e => updateMatchKeys(index, e.target.value, 'secondaryKeys')"
                          type="text"
                          class="input input-sm w-full daisy-clean"
                          placeholder="逗号分隔列表（如果为空,则不限定）"
                        />
                      </div>
                    </div>

                    <!-- 内容编辑 -->
                    <div>
                      <label class="label label-text text-xs">内容</label>
                      <textarea v-model="worldInfo.content" class="textarea w-full h-24 daisy-clean" placeholder="世界书的具体内容..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        <!-- 正则设置 -->
        <fieldset class="fieldset">
          <!-- 标题和添加按钮 -->
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-base font-medium text-base-content/80">正则设置</h4>
            <button type="button" @click="addRegexRule" class="btn btn-sm btn-primary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              添加正则
            </button>
          </div>

          <div class="space-y-4">
            <div v-if="formData.regexes.length > 0" class="space-y-3">
              <!-- 正则规则条目列表 -->
              <div v-for="(regexRule, index) in formData.regexes" :key="'regex-' + index" class="card bg-base-100 border border-base-300">
                <!-- 桌面模式 -->
                <div class="hidden lg:block card-body p-4">
                  <div class="flex items-center gap-3">
                    <!-- 展开按钮 -->
                    <button type="button" @click="toggleRegexRuleExpand(index)" class="btn btn-ghost btn-sm btn-circle">
                      <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-90': regexRule.expanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <!-- 开关 -->
                    <BaseToggle :modelValue="regexRule.status === 'ENABLE'" @update:modelValue="regexRule.status = $event ? 'ENABLE' : 'DISABLE'" size="sm" />

                    <!-- 名称显示 -->
                    <div class="flex-1">
                      <span class="text-sm font-medium text-base-content">{{ regexRule.name || '未命名正则规则' }}</span>
                    </div>

                    <!-- 删除按钮 -->
                    <button type="button" @click="removeRegexRule(index)" class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <!-- 展开的详细编辑区域 -->
                  <div v-if="regexRule.expanded" class="mt-4 pt-4 border-t border-base-300 space-y-3">
                    <!-- 名称编辑 -->
                    <div>
                      <label class="label label-text text-sm">名称</label>
                      <input v-model="regexRule.name" type="text" class="input input-sm w-full daisy-clean" placeholder="正则规则名称" />
                    </div>

                    <!-- 正则表达式 -->
                    <div>
                      <label class="label label-text text-sm">正则表达式</label>
                      <input v-model="regexRule.regex" type="text" class="input input-sm w-full daisy-clean" placeholder="例如: /<nr>([\\s\\S]*?)<\\/nr>/g" />
                    </div>

                    <!-- 作用域 -->
                    <div>
                      <label class="label label-text text-sm mb-2">作用域</label>
                      <div class="grid grid-cols-2 gap-3">
                        <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                          <label class="label-text text-sm font-medium">用户输入</label>
                          <BaseToggle v-model="regexRule.scopes.USER_INPUT" size="sm" />
                        </div>
                        <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                          <label class="label-text text-sm font-medium">AI输出</label>
                          <BaseToggle v-model="regexRule.scopes.AI_OUTPUT" size="sm" />
                        </div>
                        <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                          <label class="label-text text-sm font-medium">世界书</label>
                          <BaseToggle v-model="regexRule.scopes.WORLD_INFO" size="sm" />
                        </div>
                        <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                          <label class="label-text text-sm font-medium">推理</label>
                          <BaseToggle v-model="regexRule.scopes.REASONING" size="sm" />
                        </div>
                      </div>
                    </div>

                    <!-- 内容编辑 -->
                    <div>
                      <label class="label label-text text-sm">内容</label>
                      <textarea v-model="regexRule.content" class="textarea w-full h-32 daisy-clean" placeholder="正则规则的具体内容..."></textarea>
                    </div>
                  </div>
                </div>

                <!-- 手机模式 -->
                <div class="lg:hidden card-body p-3">
                  <div class="flex items-center gap-3">
                    <!-- 展开按钮 -->
                    <button type="button" @click="toggleRegexRuleExpand(index)" class="btn btn-ghost btn-sm btn-circle">
                      <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-90': regexRule.expanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <!-- 开关 -->
                    <BaseToggle :modelValue="regexRule.status === 'ENABLE'" @update:modelValue="regexRule.status = $event ? 'ENABLE' : 'DISABLE'" size="sm" />

                    <!-- 名称显示 -->
                    <div class="flex-1">
                      <span class="text-sm font-medium text-base-content">{{ regexRule.name || '未命名正则规则' }}</span>
                    </div>

                    <!-- 删除按钮 -->
                    <button type="button" @click="removeRegexRule(index)" class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <!-- 展开的详细编辑区域 -->
                  <div v-if="regexRule.expanded" class="mt-3 pt-3 border-t border-base-300 space-y-3">
                    <!-- 名称编辑 -->
                    <div>
                      <label class="label label-text text-xs">名称</label>
                      <input v-model="regexRule.name" type="text" class="input input-sm w-full daisy-clean" placeholder="正则规则名称" />
                    </div>

                    <!-- 正则表达式 -->
                    <div>
                      <label class="label label-text text-xs">正则表达式</label>
                      <input v-model="regexRule.regex" type="text" class="input input-sm w-full daisy-clean" placeholder="例如: /<nr>([\\s\\S]*?)<\\/nr>/g" />
                    </div>

                    <!-- 作用域 -->
                    <div>
                      <label class="label label-text text-xs mb-2">作用域</label>
                      <div class="grid grid-cols-2 gap-2">
                        <div class="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                          <label class="label-text text-xs font-medium">用户输入</label>
                          <BaseToggle v-model="regexRule.scopes.USER_INPUT" size="sm" />
                        </div>
                        <div class="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                          <label class="label-text text-xs font-medium">AI输出</label>
                          <BaseToggle v-model="regexRule.scopes.AI_OUTPUT" size="sm" />
                        </div>
                        <div class="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                          <label class="label-text text-xs font-medium">世界书</label>
                          <BaseToggle v-model="regexRule.scopes.WORLD_INFO" size="sm" />
                        </div>
                        <div class="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                          <label class="label-text text-xs font-medium">推理</label>
                          <BaseToggle v-model="regexRule.scopes.REASONING" size="sm" />
                        </div>
                      </div>
                    </div>

                    <!-- 内容编辑 -->
                    <div>
                      <label class="label label-text text-xs">内容</label>
                      <textarea v-model="regexRule.content" class="textarea w-full h-24 daisy-clean" placeholder="正则规则的具体内容..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  </form>

  <!-- 操作按钮区域 -->
  <div class="flex gap-3 lg:justify-end">
    <button type="button" @click="saveAsDraft" class="btn btn-outline flex-1 lg:flex-none lg:w-32" :disabled="isSubmitting">
      <span v-if="isSubmitting && currentAction === 'draft'" class="loading loading-spinner loading-sm"></span>
      {{ isSubmitting && currentAction === 'draft' ? '保存中...' : '存为草稿' }}
    </button>
    <button type="button" @click="handleSubmit" class="btn btn-primary flex-1 lg:flex-none lg:w-32" :disabled="isSubmitting">
      <span v-if="isSubmitting && currentAction === 'publish'" class="loading loading-spinner loading-sm"></span>
      {{ getSubmitButtonText() }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import BaseToggle from '@/components/base/BaseToggle.vue'

// Props
const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
})

// Emits
const emit = defineEmits(['character-saved', 'character-draft-saved'])

// 表单数据
const formData = reactive({
  name: '',
  description: '',
  backgroundImageFile: null,
  backgroundImage: '',
  personality: '',
  scenario: '',
  mainPrompt: '',
  postHistoryPrompt: '',
  firstMessage: '',
  visibility: 'private',

  worldInfos: [],
  regexes: [],
  alternateGreetings: [],
  exampleMessages: [],
})

// 提交状态
const isSubmitting = ref(false)
const currentAction = ref('') // 'draft' 或 'publish'

// 图片上传状态
const isDragOver = ref(false)
const backgroundImageInput = ref(null)

// 高级设置开关
const showAdvancedSettings = ref(false)

// 获取提交按钮文本
const getSubmitButtonText = () => {
  if (isSubmitting.value && currentAction.value === 'publish') {
    return props.initialData ? '保存中...' : '创建中...'
  }
  return props.initialData ? '保存修改' : '创建角色'
}

// 默认值常量
const DEFAULT_WORLD_INFO = {
  name: '',
  content: '',
  skipKeyMatch: false,
  keys: [],
  secondaryKeys: [],
  keyMatchRelation: 'AND_ANY',
  position: 'BEFORE_CHARACTER',
  depth: 4,
  recursive: true,
  preventRecursion: false,
  order: 100,
  status: 'ENABLE',
}

const DEFAULT_REGEX_RULE = {
  name: '',
  regex: '',
  content: '',
  scopes: {
    USER_INPUT: false,
    AI_OUTPUT: false,
    WORLD_INFO: false,
    REASONING: false,
  },
  status: 'ENABLE',
  expanded: false,
}

const DEFAULT_EXAMPLE_MESSAGE = {
  userInput: '',
  aiOutput: '',
}

// 数据规范化辅助函数
const normalizeWorldInfo = (wi, index) => {
  const normalized = {
    ...DEFAULT_WORLD_INFO,
    ...wi,
    id: wi.id || Date.now() + index,
    expanded: false,
  }

  if (!Array.isArray(normalized.keys)) {
    normalized.keys = []
  }
  if (!Array.isArray(normalized.secondaryKeys)) {
    normalized.secondaryKeys = []
  }

  return normalized
}

const normalizeRegexRule = (rr, index) => {
  const normalized = {
    ...DEFAULT_REGEX_RULE,
    ...rr,
    id: rr.id || Date.now() + index,
    expanded: false,
  }

  if (Array.isArray(rr.scopes)) {
    normalized.scopes = {
      USER_INPUT: rr.scopes.includes('USER_INPUT'),
      AI_OUTPUT: rr.scopes.includes('AI_OUTPUT'),
      WORLD_INFO: rr.scopes.includes('WORLD_INFO'),
      REASONING: rr.scopes.includes('REASONING'),
    }
  } else if (!normalized.scopes || typeof normalized.scopes !== 'object') {
    normalized.scopes = { ...DEFAULT_REGEX_RULE.scopes }
  }

  return normalized
}

const normalizeExampleMessage = (em, index) => ({
  ...DEFAULT_EXAMPLE_MESSAGE,
  ...em,
  id: em.id || Date.now() + index,
})

// 重置表单
const resetForm = () => {
  if (formData.backgroundImage) {
    URL.revokeObjectURL(formData.backgroundImage)
  }

  formData.name = ''
  formData.description = ''
  formData.personality = ''
  formData.scenario = ''
  formData.mainPrompt = ''
  formData.postHistoryPrompt = ''
  formData.firstMessage = ''
  formData.visibility = 'private'
  formData.backgroundImageFile = null
  formData.backgroundImage = ''
  formData.worldInfos.length = 0
  formData.regexes.length = 0
  formData.alternateGreetings.length = 0
  formData.exampleMessages.length = 0

  if (backgroundImageInput.value) {
    backgroundImageInput.value.value = ''
  }
}

// 加载初始数据
const loadInitialData = () => {
  if (!props.initialData) return

  const data = props.initialData

  // 基础字段
  formData.name = data.name || ''
  formData.description = data.description || ''
  formData.personality = data.personality || ''
  formData.scenario = data.scenario || ''
  formData.mainPrompt = data.mainPrompt || ''
  formData.postHistoryPrompt = data.postHistoryPrompt || ''
  formData.firstMessage = data.firstMessage || ''
  formData.visibility = data.visibility || 'private'
  formData.backgroundImageFile = data.backgroundImageFile || null
  formData.backgroundImage = data.backgroundImage || ''

  // 数组字段（规范化处理）
  formData.worldInfos = (data.worldInfos || []).map(normalizeWorldInfo)
  formData.regexes = (data.regexes || []).map(normalizeRegexRule)
  formData.alternateGreetings = data.alternateGreetings ? [...data.alternateGreetings] : []
  formData.exampleMessages = (data.exampleMessages || []).map(normalizeExampleMessage)
}

// 监听初始数据变化
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      loadInitialData()
    } else {
      resetForm()
    }
  },
  { deep: true }
)

// 组件挂载时加载初始数据
onMounted(() => {
  if (props.initialData) {
    loadInitialData()
  }
})

// 存为草稿
const saveAsDraft = async () => {
  try {
    currentAction.value = 'draft'
    isSubmitting.value = true

    // 基本验证（草稿只需要姓名）
    if (!formData.name.trim()) {
      alert('请至少填写角色姓名')
      return
    }

    // 转换 regexes 的 scopes 对象为数组
    const draftData = {
      ...formData,
      visibility: 'private',
      regexes: formData.regexes.map(regex => ({
        ...regex,
        scopes: Object.entries(regex.scopes)
          .filter(([_, enabled]) => enabled)
          .map(([scope]) => scope),
      })),
    }

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('保存草稿:', draftData)

    // 发送保存成功事件
    emit('character-draft-saved', draftData)

    alert('草稿保存成功！')
  } catch (error) {
    console.error('保存草稿失败:', error)
    alert('保存草稿失败，请重试')
  } finally {
    isSubmitting.value = false
    currentAction.value = ''
  }
}

// 表单提交处理（发布）
const handleSubmit = async () => {
  try {
    currentAction.value = 'publish'
    isSubmitting.value = true

    // 表单验证
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('请填写所有必填字段')
      return
    }

    // 转换 regexes 的 scopes 对象为数组
    const submitData = {
      ...formData,
      regexes: formData.regexes.map(regex => ({
        ...regex,
        scopes: Object.entries(regex.scopes)
          .filter(([_, enabled]) => enabled)
          .map(([scope]) => scope),
      })),
    }

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log(props.initialData ? '更新聊天机器人:' : '创建聊天机器人:', submitData)

    // 发送创建/更新成功事件
    emit('character-saved', submitData)

    alert(props.initialData ? '角色更新成功！' : '聊天机器人创建成功！')
  } catch (error) {
    console.error(props.initialData ? '更新失败:' : '创建失败:', error)
    alert(props.initialData ? '更新失败，请重试' : '创建失败，请重试')
  } finally {
    isSubmitting.value = false
    currentAction.value = ''
  }
}

// 清理内存泄漏
onUnmounted(() => {
  if (formData.backgroundImage) {
    URL.revokeObjectURL(formData.backgroundImage)
  }
})

// 背景图片上传相关函数
const triggerBackgroundImageUpload = () => {
  backgroundImageInput.value?.click()
}

const handleBackgroundImageChange = event => {
  const file = event.target.files?.[0]
  if (file) {
    processBackgroundImage(file)
  }
}

const handleBackgroundImageDrop = event => {
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processBackgroundImage(file)
  }
}

const processBackgroundImage = file => {
  // 检查文件大小 (5MB 限制)
  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过 5MB')
    return
  }

  formData.backgroundImageFile = file
  formData.backgroundImage = URL.createObjectURL(file)
}

const removeBackgroundImage = () => {
  if (formData.backgroundImage) {
    URL.revokeObjectURL(formData.backgroundImage)
  }
  formData.backgroundImageFile = null
  formData.backgroundImage = ''
  if (backgroundImageInput.value) {
    backgroundImageInput.value.value = ''
  }
}

// 世界书相关方法
const addWorldInfo = () => {
  formData.worldInfos.push({
    ...DEFAULT_WORLD_INFO,
    id: Date.now(),
    expanded: false,
  })
}

const removeWorldInfo = index => {
  formData.worldInfos.splice(index, 1)
}

const toggleWorldInfoExpand = index => {
  formData.worldInfos[index].expanded = !formData.worldInfos[index].expanded
}

const handleTriggerModeChange = (index, value) => {
  const worldInfo = formData.worldInfos[index]
  worldInfo.skipKeyMatch = value === 'always'

  if (value === 'match') {
    if (!worldInfo.keys) worldInfo.keys = []
    if (!worldInfo.secondaryKeys) worldInfo.secondaryKeys = []
    if (!worldInfo.keyMatchRelation) worldInfo.keyMatchRelation = 'AND_ANY'
  }
}

const updateMatchKeys = (index, value, field) => {
  const keys = value.split(',').map(k => k.trim()).filter(k => k)
  formData.worldInfos[index][field] = keys
}

const getMatchKeysString = (keys) => {
  if (!keys || !Array.isArray(keys)) return ''
  return keys.join(', ')
}

// 正则规则相关方法
const addRegexRule = () => {
  formData.regexes.push({
    ...DEFAULT_REGEX_RULE,
    id: Date.now(),
  })
}

const removeRegexRule = index => {
  formData.regexes.splice(index, 1)
}

const toggleRegexRuleExpand = index => {
  formData.regexes[index].expanded = !formData.regexes[index].expanded
}

// 多开场白相关方法
const addGreeting = () => {
  if (!formData.alternateGreetings) {
    formData.alternateGreetings = []
  }
  formData.alternateGreetings.push('')
}

const removeGreeting = index => {
  formData.alternateGreetings.splice(index, 1)
}

// 对话示例相关方法
const addDialogExample = () => {
  formData.exampleMessages.push({
    ...DEFAULT_EXAMPLE_MESSAGE,
    id: Date.now(),
  })
}

const removeDialogExample = index => {
  formData.exampleMessages.splice(index, 1)
}

// 暴露方法给父组件使用
defineExpose({
  resetForm,
  loadInitialData,
})
</script>
