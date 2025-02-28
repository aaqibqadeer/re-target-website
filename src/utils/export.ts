export const handleExport = (data: any, type: 'json' | 'csv') => {
  if (type === 'json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.json'
    a.click()
    URL.revokeObjectURL(url)
  } else if (type === 'csv') {
    let csv = 'Section,Icon,Name,City,State,ServiceArea,Users,URL\n'
    data.forEach((section: any) => {
      section.list.forEach((item: any) => {
        csv += `${section.name},"${item.icon}","${item.name}","${item.city}","${
          item.state
        }","${item.serviceArea || ''}",${item.users},"${item.url}"\n`
      })
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }
}