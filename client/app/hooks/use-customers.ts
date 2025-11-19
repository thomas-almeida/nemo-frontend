'use client'

import { useEffect } from 'react'
import useCustomerStore from '@/app/store/customer-store'
import { getAllCustomers } from '@/app/service/customer-service'
import { useAuth } from './use-auth'

export function useCustomers() {
    const { customers, isLoading, error } = useCustomerStore()
    const { user } = useAuth()

    useEffect(() => {
        const fetchCustomers = async () => {
            if (user.id) {
                try {
                    const customersData = await getAllCustomers(user.id)
                    useCustomerStore.setState({ customers: customersData.data })
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchCustomers()
    }, [user.id])

    return { customers, isLoading, error }
}