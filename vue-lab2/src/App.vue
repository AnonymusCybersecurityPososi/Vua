<template>
  <div class="main-wrap">
    <h1>Билд персонажа (РПГ)</h1>
    
    <div class="stats-panel" :class="{'over-red': st.isOverload}">
      <h3>Характеристики</h3>
      <div>Атака: {{ st.bSt.atk }} ({{ st.totalStats.atkB >= 0 ? '+' : '' }}{{ st.totalStats.atkB }}) = <b>{{ st.totalStats.atkTot }}</b></div>
      <div>Защита: {{ st.bSt.def }} ({{ st.totalStats.defB >= 0 ? '+' : '' }}{{ st.totalStats.defB }}) = <b>{{ st.totalStats.defTot }}</b></div>
      <div>
        Скорость: {{ st.bSt.spd }} ({{ st.totalStats.spdB >= 0 ? '+' : '' }}{{ st.totalStats.spdB }}) = 
        <b>{{ st.totalStats.spdTot }}</b>
      </div>
      
      <div style="margin-top:10px">
        Вес: {{ st.curWeight }} / {{ st.maxWg }} кг
        <span v-if="st.isOverload" style="color:red; font-weight:bold;"> - ПЕРЕВАНТАЖЕНИЙ!</span>
      </div>
    </div>

    <div class="content-flex">
      <div class="eq-zone">
        <h3>Слоты (нажми чтоб снять)</h3>
        
        <div class="slot-box" @click="st.unequip('helmet')">
          <span>Шлем: </span>
          <span v-if="st.nadyato.helmet" class="itm-name">{{ st.nadyato.helmet.name }}</span>
          <span v-else class="empty-slot">пусто</span>
        </div>

        <div class="slot-box" @click="st.unequip('armor')">
          <span>Броня: </span>
          <span v-if="st.nadyato.armor" class="itm-name">{{ st.nadyato.armor.name }}</span>
          <span v-else class="empty-slot">пусто</span>
        </div>

        <div class="slot-box" @click="st.unequip('weapon')">
          <span>Оружие: </span>
          <span v-if="st.nadyato.weapon" class="itm-name">{{ st.nadyato.weapon.name }}</span>
          <span v-else class="empty-slot">пусто</span>
        </div>

        <div class="slot-box" @click="st.unequip('boots')">
          <span>Обувь: </span>
          <span v-if="st.nadyato.boots" class="itm-name">{{ st.nadyato.boots.name }}</span>
          <span v-else class="empty-slot">пусто</span>
        </div>

        <button @click="st.clearAll" style="margin-top:15px;">Скинуть билд</button>
      </div>

      <div class="inv-zone">
        <h3>Инвентарь (доступно)</h3>
        
        <div 
          v-for="itm in availableItems" 
          :key="itm.id" 
          class="inv-item"
          @click="st.equipItm(itm)"
          @mouseover="hoveredId = itm.id"
          @mouseleave="hoveredId = null"
        >
          <b>{{ itm.name }}</b> ({{ itm.t }}) | Вес: {{ itm.w }}
          
          <!-- Тултип -->
          <div class="tultip" v-if="hoveredId === itm.id">
             Сравнение:<br/>
             Атака: <span :class="getDiffClass(itm.stats.atk, st.nadyato[itm.t]?.stats.atk || 0)">{{ getDiffFormat(itm.stats.atk, st.nadyato[itm.t]?.stats.atk || 0) }}</span><br/>
             Защита: <span :class="getDiffClass(itm.stats.def, st.nadyato[itm.t]?.stats.def || 0)">{{ getDiffFormat(itm.stats.def, st.nadyato[itm.t]?.stats.def || 0) }}</span><br/>
             Скорость: <span :class="getDiffClass(itm.stats.spd, st.nadyato[itm.t]?.stats.spd || 0)">{{ getDiffFormat(itm.stats.spd, st.nadyato[itm.t]?.stats.spd || 0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRpgStore } from './store/rpgStore' // проверь путь

const st = useRpgStore()
const hoveredId = ref<number | null>(null)

// let mockId = 99; // TODO del

onMounted(() => {
  st.loadLocal()
})

const availableItems = computed(() => {
  let nadIds = [
    st.nadyato.helmet?.id, 
    st.nadyato.armor?.id, 
    st.nadyato.weapon?.id, 
    st.nadyato.boots?.id
  ]
  return st.itemsArr.filter(i => !nadIds.includes(i.id))
})

const getDiffFormat = (newVal: number, oldVal: number) => {
  let d = newVal - oldVal
  if (d > 0) return '+' + d
  return d
}

const getDiffClass = (newVal: number, oldVal: number) => {
  let diff = newVal - oldVal
  if (diff > 0) return 'grn'
  if (diff < 0) return 'redC'
  return ''
}
</script>

<style scoped>
/* Стили остались прежними */
.main-wrap {
  font-family: sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #2a2a2a;
  color: #eee;
}

.stats-panel {
  background: #333;
  padding: 15px;
  border: 2px solid #555;
  margin-bottom: 20px;
  transition: 0.3s;
}

.over-red {
  border-color: red;
  background: #442222;
}

.content-flex {
  display: flex;
  gap: 20px;
}

.eq-zone, .inv-zone {
  flex: 1;
  background: #3a3a3a;
  padding: 15px;
  border-radius: 5px;
}

.slot-box {
  padding: 10px;
  border: 1px dashed #777;
  margin-bottom: 10px;
  cursor: pointer;
  background: #444;
}
.slot-box:hover {
  background: #555;
}

.empty-slot {
  color: #888;
  font-style: italic;
  opacity: 0.7;
}

.itm-name {
  color: gold;
  font-weight: bold;
}

.inv-item {
  padding: 10px;
  border: 1px solid #555;
  margin-bottom: 5px;
  cursor: pointer;
  position: relative;
  background: #222;
}

.inv-item:hover {
  background: #444;
}

.tultip {
  position: absolute;
  top: 100%;
  left: 0;
  background: #111;
  border: 1px solid #fff;
  padding: 8px;
  z-index: 10;
  font-size: 14px;
  pointer-events: none;
}

.grn { color: #00ff00; }
.redC { color: #ff3333; }
</style>