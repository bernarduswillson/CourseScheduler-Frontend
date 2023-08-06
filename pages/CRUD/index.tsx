import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Data {
  id: number
  nama_mk: string
  sks: number
  jurusan_mk: string
  semester_minimal: number
  prediksi: string
}

const CRUD: React.FC = () => {
  const [data, setData] = useState<Data[]>([])
  const [newData, setNewData] = useState<Data>({
    id: 0,
    nama_mk: '',
    sks: 0,
    jurusan_mk: '',
    semester_minimal: 0,
    prediksi: ''
  })

  const fetchData = async (): Promise<void> => {
    try {
      const response = await axios.get('http://localhost:8080/get')
      setData(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const postData = async (dataToPost: Data): Promise<void> => {
    try {
      const response = await axios.post('http://localhost:8080/add', dataToPost)
      console.log('Data posted successfully:', response.data)
      void fetchData()
    } catch (error) {
      console.error('Error posting data:', error)
    }
  }

  const deleteData = async (id: number): Promise<void> => {
    try {
      const response = await axios.delete(`http://localhost:8080/delete/${id}`)
      console.log('Data deleted successfully:', response.data)
      void fetchData()
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }

  const postDataJSON = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (e.target.files && e.target.files.length > 0) {
      const fileReader = new FileReader()
      fileReader.onload = async () => {
        const fileContent = fileReader.result as string
        try {
          const jsonData = JSON.parse(fileContent)
          for (const item of jsonData.data) {
            try {
              await postData(item)
            } catch (error) {
              console.error('Error posting data:', error)
            }
          }
          await fetchData()
        } catch (error) {
          console.error('Error parsing JSON file:', error)
        }
      }
      fileReader.readAsText(e.target.files[0])
    }
  }

  const handlePostData = (): void => {
    void postData(newData)
  }

  const handleDeleteData = (id: number): void => {
    void deleteData(id)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    void postDataJSON(e)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return (
    <div className='h-auto relative'>
      <div className='h-2'></div>
      <div className='text-center font-bold text-[40px]'>CRUD</div>
      <a href="/" className='bg-[#c9deff] rounded-lg p-2 ml-10 hover:opacity-80'>
        <button>back</button>
      </a>
      <div className='flex mt-2 ml-10'>
      <ul className='w-[80%]'>
          <div className='flex text-white text-center'>
            <div className='w-[40%] bg-gray-700 border-[1px]'>Mata Kuliah</div>
            <div className='w-[10%] bg-gray-700 border-[1px]'>SKS</div>
            <div className='w-[13%] bg-gray-700 border-[1px]'>Jurusan</div>
            <div className='w-[13%] bg-gray-700 border-[1px]'>Minimal Semester</div>
            <div className='w-[13%] bg-gray-700 border-[1px]'>Prediksi Indeks</div>
          </div>
          {data.length > 0
            ? (
                data.map((item) => (
                <li key={item.id} className='flex'>
                  <div className='w-[40%] border-2 p-1'>{item.nama_mk}</div>
                  <div className='w-[10%] border-2 p-1'>{item.sks}</div>
                  <div className='w-[13%] border-2 p-1'>{item.jurusan_mk}</div>
                  <div className='w-[13%] border-2 p-1'>{item.semester_minimal}</div>
                  <div className='w-[13%] border-2 p-1'>{item.prediksi}</div>
                  <button onClick={() => handleDeleteData(item.id)} className='bg-red-500 p-1 border-2'>Delete</button>
                </li>
                ))
              )
            : (
              <div className='font-bold bg-red-500 w-[80%]'>No data available</div>
              )}
        </ul>
        <div className='w-[15%]'>
          <div className='h-10'>
            Mata Kuliah:
          </div>
          <div className='h-10'>
            Jumlah SKS:
          </div>
          <div className='h-10'>
            Jurusan Mata Kuliah:
          </div>
          <div className='h-10'>
            Semester Minimal:
          </div>
          <div className='h-10'>
            Prediksi Indeks:
          </div>
          <div className='mt-20'>
            Input JSON .txt:
            <input type='file' accept='.json' onChange={handleFileInputChange} />
          </div>
        </div>
        <div className='w-[30%]'>
          <div className=''>
            <input
              type='text'
              value={newData.nama_mk}
              onChange={(e) => setNewData({ ...newData, nama_mk: e.target.value })}
              placeholder='Nama MK'
              className='h-10'
            />
          </div>
          <div>
            <input
              type='number'
              value={newData.sks}
              onChange={(e) => setNewData({ ...newData, sks: Number(e.target.value) })}
              placeholder='SKS'
              className='h-10'
            />
          </div>
          <div>
            <input
              type='text'
              value={newData.jurusan_mk}
              onChange={(e) => setNewData({ ...newData, jurusan_mk: e.target.value })}
              placeholder='Jurusan'
              className='h-10'
            />
          </div>
          <div>
            <input
              type='number'
              value={newData.semester_minimal}
              onChange={(e) => setNewData({ ...newData, semester_minimal: Number(e.target.value) })}
              placeholder='Minimal Semester'
              className='h-10'
            />
          </div>
          <div>
            <input
              type='text'
              value={newData.prediksi}
              onChange={(e) => setNewData({ ...newData, prediksi: e.target.value })}
              placeholder='Prediksi'
              className='h-10'
            />
          </div>

          <button onClick={handlePostData} className='bg-[#5c1717] text-white p-2 rounded-lg my-2 hover:opacity-80'>Post Data</button>
        </div>
      </div>
    </div>
  )
}

export default CRUD
