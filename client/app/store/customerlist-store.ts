import { create } from "zustand"
import { persist } from "zustand/middleware"

type CustomerListState = {
    customerLists: any[],
    isLoading: boolean,
    error: string | null,
}

const initialState: CustomerListState = {
    customerLists: [],
    isLoading: false,
    error: null,
}

const useCustomerList = create<CustomerListState>()(
    persist(
        (set) => ({
            ...initialState,
            setCustomerLists: (customerLists: any[]) => set({ customerLists }),
            setLoading: (isLoading: boolean) => set({ isLoading }),
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'customerlist-storage',
            partialize: (state) => ({
                customerLists: state.customerLists,
            })
        }
    )
)

export default useCustomerList