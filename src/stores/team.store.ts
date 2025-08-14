import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Team } from '@/types/common.type.ts'

export const useTeamStore = defineStore(
  'team',
  () => {
    const teamList = ref<Team[]>([])

    function getTeam(id: number): Team | undefined {
      return teamList.value.find((team) => team.id === id)
    }

    function getTeamName(id: number): string {
      const team = getTeam(id)
      return team ? team.name : ''
    }

    return {
      teamList,
      getTeam,
      getTeamName,
    }
  },
  { persist: true },
)
