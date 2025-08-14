// A mock function to mimic making an async request for data
export const fetchCount = (amount = 1): Promise<{ data: number }> =>
  new Promise<{ data: number }>((resolve, reject) => {
    setTimeout(() => {
      if (amount < 0) {
        reject(new Error("Amount must be a positive number"))
      } else {
        resolve({ data: amount })
      }
    }, 500)
  }
  )
