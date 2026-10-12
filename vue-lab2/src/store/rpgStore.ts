import { defineStore } from 'pinia'

// Вынес типы слотов отдельно, чтобы тайпскрипт не ругался на ключи
export type SlotType = 'helmet' | 'armor' | 'weapon' | 'boots'

export interface ItemZ {
  id: number
  name: string
  t: SlotType 
  stats: { atk: number; def: number; spd: number }
  w: number
}

export const useRpgStore = defineStore('mainData', {
  state: () => ({
    // база шмоток
    itemsArr: [
      { id: 1, name: 'Старый шлем', t: 'helmet', stats: { atk: 0, def: 5, spd: -1 }, w: 5 },
      { id: 2, name: 'Кожанка', t: 'armor', stats: { atk: 0, def: 4, spd: 2 }, w: 3 },
      { id: 3, name: 'Тяжелый Доспех', t: 'armor', stats: { atk: 0, def: 18, spd: -6 }, w: 25 },
      { id: 4, name: 'Ржавый Меч', t: 'weapon', stats: { atk: 8, def: 1, spd: 0 }, w: 4 },
      { id: 5, name: 'Ножик', t: 'weapon', stats: { atk: 3, def: 0, spd: 4 }, w: 1 },
      { id: 6, name: 'Сапоги бомжа', t: 'boots', stats: { atk: 0, def: 1, spd: 1 }, w: 2 },
      { id: 7, name: 'Берцы', t: 'boots', stats: { atk: 2, def: 4, spd: -1 }, w: 5 }
    ] as ItemZ[],
    
    // явно указали тип объекта, убрав any
    nadyato: {
      helmet: null,
      armor: null,
      weapon: null,
      boots: null
    } as Record<SlotType, ItemZ | null>, 

    bSt: { atk: 15, def: 10, spd: 12 }, // базовые статы
    maxWg: 40, 
    // tmpFlag: false, // забытый мусор
  }),

  getters: {
    // заменил for..in на Object.values, чтобы TS не плакал
    curWeight(state): number {
      let w = 0
      Object.values(state.nadyato).forEach(itm => {
        if (itm) w += itm.w
      })
      return w
    },
    
    isOverload(state): boolean {
      // считаем прямо тут, чтобы не было конфликтов с this
      let w = 0
      Object.values(state.nadyato).forEach(itm => {
        if (itm) w += itm.w
      })
      return w > state.maxWg
    },

    totalStats(state) {
      let bnsAtk = 0
      let bnsDef = 0
      let bnsSpd = 0
      let w = 0

      // Считаем бонусы
      Object.values(state.nadyato).forEach(itm => {
        if (itm) {
          bnsAtk += itm.stats.atk
          bnsDef += itm.stats.def
          bnsSpd += itm.stats.spd
          w += itm.w
        }
      })

      let finalSpd = (state.bSt.spd + bnsSpd)
      if (w > state.maxWg) finalSpd = 0 // проверка перегруза

      return {
        atkB: bnsAtk,
        defB: bnsDef,
        spdB: bnsSpd,
        atkTot: state.bSt.atk + bnsAtk,
        defTot: state.bSt.def + bnsDef,
        spdTot: finalSpd
      }
    }
  },

  actions: {
    equipItm(item: ItemZ) {
      this.nadyato[item.t] = item
      this.saveLocal()
    },
    
    // добавил тип SlotType вместо string
    unequip(slotName: SlotType) {
      this.nadyato[slotName] = null
      this.saveLocal()
    },

    clearAll() {
      this.nadyato = { helmet: null, armor: null, weapon: null, boots: null }
      this.saveLocal()
    },

    saveLocal() {
      localStorage.setItem('rpg_save_123', JSON.stringify(this.nadyato))
    },

    loadLocal() {
      let d = localStorage.getItem('rpg_save_123')
      if (d) {
        this.nadyato = JSON.parse(d)
        // console.log("loaded", this.nadyato)
      }
    }
  }
})