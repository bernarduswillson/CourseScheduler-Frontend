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

const LandingPage: React.FC = () => {
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

  const handlePostData = (): void => {
    void postData(newData)
  }

  const handleDeleteData = (id: number): void => {
    void deleteData(id)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return (
    <div className='h-screen relative'>
      <ul>
        {data.length > 0
          ? (
              data.map((item) => (
              <li key={item.id}>
                {item.nama_mk} - {item.sks} SKS - {item.jurusan_mk} - {item.semester_minimal} - {item.prediksi}
                <button onClick={() => handleDeleteData(item.id)}>Delete</button>
              </li>
              ))
            )
          : (
          <li>No data available</li>
            )}
      </ul>
      <input
        type='text'
        value={newData.nama_mk}
        onChange={(e) => setNewData({ ...newData, nama_mk: e.target.value })}
        placeholder='Nama MK'
      />
      <input
        type='number'
        value={newData.sks}
        onChange={(e) => setNewData({ ...newData, sks: parseInt(e.target.value) })}
        placeholder='SKS'
      />
      <input
        type='text'
        value={newData.jurusan_mk}
        onChange={(e) => setNewData({ ...newData, jurusan_mk: e.target.value })}
        placeholder='Jurusan MK'
      />
      <input
        type='number'
        value={newData.semester_minimal}
        onChange={(e) =>
          setNewData({ ...newData, semester_minimal: parseInt(e.target.value) })
        }
        placeholder='Minimal Semester'
      />
      <input
        type='text'
        value={newData.prediksi}
        onChange={(e) => setNewData({ ...newData, prediksi: e.target.value })}
        placeholder='Prediksi'
      />

      {/* Button to post data */}
      <button onClick={handlePostData}>Post Data</button>
    </div>
  )
}

export default LandingPage
