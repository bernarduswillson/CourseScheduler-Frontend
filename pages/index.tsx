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
  const [totalSelectedScore, setTotalSelectedScore] = useState<number>(0)
  const [totalSelectedSKS, setTotalSelectedSKS] = useState<number>(0)

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
      setTotalSelectedScore(response.data.totalSelectedScore)
      setTotalSelectedSKS(response.data.totalSelectedSKS)
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
      <div className='h-2'></div>
      <div className='text-center font-bold text-[40px]'>Course Scheduler</div>
      <a href="/CRUD" className='bg-[#c9deff] rounded-lg p-2 ml-10 hover:opacity-80'>
        <button>CRUD</button>
      </a>
      <div className='flex mt-2 ml-10'>
        <ul className='w-[35%]'>
          <div className='flex text-white text-center'>
            <div className='w-[40%] bg-gray-700 border-[1px]'>Mata Kuliah</div>
            <div className='w-[10%] bg-gray-700 border-[1px]'>SKS</div>
            <div className='w-[13%] bg-gray-700 border-[1px]'>Jurusan</div>
            <div className='w-[15%] bg-gray-700 border-[1px]'>Minimal Semester</div>
            <div className='w-[15%] bg-gray-700 border-[1px]'>Prediksi Indeks</div>
          </div>
          {data.length > 0
            ? (
                data.map((item) => (
                <li key={item.id} className='flex'>
                  <div className='w-[40%] border-2 p-1'>{item.nama_mk}</div>
                  <div className='w-[10%] border-2 p-1'>{item.sks}</div>
                  <div className='w-[13%] border-2 p-1'>{item.jurusan_mk}</div>
                  <div className='w-[15%] border-2 p-1'>{item.semester_minimal}</div>
                  <div className='w-[15%] border-2 p-1'>{item.prediksi}</div>
                </li>
                ))
              )
            : (
              <div className='font-bold bg-red-500 w-[93%] p-2'>No data available</div>
              )}
        </ul>
        <div className='w-[65%]'>
          <div className='flex font-bold'>
            <div className='w-[20%] border-2 p-1'>Jurusan</div>
            <div className='w-[20%] border-2 p-1'>Semester Pengambilan</div>
            <div className='w-[20%] border-2 p-1'>SKS Minimal</div>
            <div className='w-[20%] border-2 p-1'>SKS Maksimal</div>
          </div>
          <div>
            <input
              type='text'
              value={userData.jurusan}
              onChange={(e) => setUserData({ ...userData, jurusan: e.target.value })}
              placeholder='Jurusan'
              className='w-[20%]'
            />
            <input
              type='number'
              value={userData.semester_ambil}
              onChange={(e) => setUserData({ ...userData, semester_ambil: parseInt(e.target.value) })}
              placeholder='Semester Pengambilan'
              className='w-[20%]'
            />
            <input
              type='number'
              value={userData.sks_minimal}
              onChange={(e) => setUserData({ ...userData, sks_minimal: parseInt(e.target.value) })}
              placeholder='SKS Minimal'
              className='w-[20%]'
            />
            <input
              type='number'
              value={userData.sks_maksimal}
              onChange={(e) => setUserData({ ...userData, sks_maksimal: parseInt(e.target.value) })}
              placeholder='SKS Maksimal'
              className='w-[20%]'
            />

            <button onClick={handlePostUserData} className='bg-[#5c1717] text-white p-2 rounded-lg ml-2 hover:opacity-80'>Search</button>
          </div>
          <div>
            <h2>Selected Courses:</h2>
              <div className='flex text-white text-center'>
                <div className='w-[40%] bg-gray-700 border-[1px]'>Mata Kuliah</div>
                <div className='w-[10%] bg-gray-700 border-[1px]'>SKS</div>
                <div className='w-[10%] bg-gray-700 border-[1px]'>Jurusan</div>
                <div className='w-[10%] bg-gray-700 border-[1px]'>Minimal Semester</div>
                <div className='w-[10%] bg-gray-700 border-[1px]'>Prediksi Indeks</div>
              </div>
              {selectedCourses.length > 0
                ? (
                    selectedCourses.map((course) => (
                    <li key={course.id} className='flex'>
                      <div className='w-[40%] border-2 p-1'>{course.nama_mk}</div>
                      <div className='w-[10%] border-2 p-1'>{course.sks}</div>
                      <div className='w-[10%] border-2 p-1'>{course.jurusan_mk}</div>
                      <div className='w-[10%] border-2 p-1'>{course.semester_minimal}</div>
                      <div className='w-[10%] border-2 p-1'>{course.prediksi}</div>
                    </li>
                    ))
                  )
                : (
                <div className='font-bold bg-red-500 w-[80%] p-2'>No course available</div>
                  )}
            <h2>Prediksi IP: <span className='font-bold'>{totalSelectedScore.toFixed(2)}</span></h2>
            <h2>Jumlah SKS: <span className='font-bold'>{totalSelectedSKS}</span></h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
