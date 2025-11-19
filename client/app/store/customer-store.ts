import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CustomerState = {
    customers: any[],
    isLoading: boolean,
    error: string | null,
}

const initialState: CustomerState = {
    customers: [],
    isLoading: false,
    error: null,
}


const useCustomerStore = create<CustomerState>()(
    persist(
        (set) => ({
            ...initialState,
            setCustomers: (customers: any[]) => set({ customers }),
            setLoading: (isLoading: boolean) => set({ isLoading }),
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'customer-storage',
            partialize: (state) => ({
                customers: state.customers,
            })
        }
    )
)

export default useCustomerStore
