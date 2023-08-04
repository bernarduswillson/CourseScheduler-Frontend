import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Data {
  id: number
  nama_mk: string
  sks: number
  jurusan_mk: string
  semester_minimal: number
  prediksi: string
}

interface UserData {
  jurusan: string
  semester_ambil: number
  sks_minimal: number
  sks_maksimal: number
}

const LandingPage: React.FC = () => {
  const [data, setData] = useState<Data[]>([])
  const [userData, setUserData] = useState<UserData>({
    jurusan: '',
    semester_ambil: 0,
    sks_minimal: 0,
    sks_maksimal: 0
  })
  const [selectedCourses, setSelectedCourses] = useState<Data[]>([])

  const fetchData = async (): Promise<void> => {
    try {
      const response = await axios.get('http://localhost:8080/get')
      setData(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const postUserData = async (dataToPost: UserData): Promise<void> => {
    try {
      const response = await axios.post('http://localhost:8080/schedule', dataToPost)
      console.log('Data posted successfully:', response.data)
      setSelectedCourses(response.data.selectedCourses)
      void fetchData()
    } catch (error) {
      console.error('Error posting data:', error)
    }
  }

  const handlePostUserData = (): void => {
    void postUserData(userData)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return (
    <div className='h-auto relative'>
      <a href="/CRUD">
        <button>CRUD</button>
      </a>
      <div className='flex'>
        <ul className='w-1/2'>
          {data.length > 0
            ? (
                data.map((item) => (
                <li key={item.id}>
                  {item.nama_mk} - {item.sks} SKS - {item.jurusan_mk} - {item.semester_minimal} - {item.prediksi}
                </li>
                ))
              )
            : (
            <li>No data available</li>
              )}
        </ul>
        <div className='w-1/2'>
          <div>
            <input
              type='text'
              value={userData.jurusan}
              onChange={(e) => setUserData({ ...userData, jurusan: e.target.value })}
              placeholder='Jurusan'
            />
            <input
              type='number'
              value={userData.semester_ambil}
              onChange={(e) => setUserData({ ...userData, semester_ambil: parseInt(e.target.value) })}
              placeholder='Semester Pengambilan'
            />
            <input
              type='number'
              value={userData.sks_minimal}
              onChange={(e) => setUserData({ ...userData, sks_minimal: parseInt(e.target.value) })}
              placeholder='SKS Minimal'
            />
            <input
              type='number'
              value={userData.sks_maksimal}
              onChange={(e) => setUserData({ ...userData, sks_maksimal: parseInt(e.target.value) })}
              placeholder='SKS Maksimal'
            />

            <button onClick={handlePostUserData}>Post User Data</button>
          </div>
          <div>
          <h2>Selected Courses:</h2>
            <ul>
              {selectedCourses.map((course) => (
                <li key={course.id}>
                  {course.nama_mk} - {course.sks} SKS - {course.jurusan_mk} - {course.semester_minimal} - {course.prediksi}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
