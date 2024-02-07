from datetime import datetime
from datetime import timedelta
#from PathFile import Path_Image_Reconition_Data # 경로지정파일
from PIL import Image
from io import BytesIO

import base64
import mariadb
import sys

# DB설정
config = {
    'host': '10.101.169.86',
    'port': 3306,
    'user': 'root',
    'password': '1234',
    'database': 'wb38'
}

# DB연결
def DB_Connect():
    try:
        conn = mariadb.connect(**config)
        return conn
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB: {e}")
        sys.exit(1)

# DB저장 <인식 정보를 데이터베이스에 저장하는 함수>
def Save_Recognition_Data(stunum, has_glasses, client_socket):
    conn = DB_Connect()
    cur = conn.cursor()

    try:
        # 사용자 이름 조회
        query = "SELECT name FROM user WHERE stunum = ?"
        cur.execute(query, (stunum,))
        result = cur.fetchone()
        name = result[0] if result else "Unknown"

        # 현재 날짜 확인
        today = datetime.now().date()

        # 오늘 날짜의 기록이 이미 있는지 확인
        query = "SELECT COUNT(*) FROM USER_POINT WHERE stunum = ? AND DATE(date) = ?"
        cur.execute(query, (stunum, today))
        count = cur.fetchone()[0]

        if count == 0:
            # 오늘 날짜의 기록이 없으면 새로운 기록을 추가
            query = "INSERT INTO USER_POINT (date, stunum, has_glasses) VALUES (NOW(3), ?, ?)"
            cur.execute(query, (stunum, has_glasses))
            conn.commit()
            
    except mariadb.Error as e:
        print(f"Error saving recognition data: {e}")
        
    finally:
        cur.close()
        conn.close()
# db에 출석 정보 저장
def Save_Attendance_Data(stunum):
    date = datetime.now()
    conn = DB_Connect()
    cur = conn.cursor()

    try:
        query = "INSERT INTO user_check (stunum, date) VALUES (?, ?)"
        cur.execute(query, (stunum, date))
        conn.commit()
        print(f"Attendance saved in database for: {stunum}, {date}")
    except mariadb.Error as e:
        print(f"Error saving attendance data to database: {e}")
    finally:
        cur.close()
        conn.close()

# DB를 통해 전날의 안경착용 유무 확인 Yesterday_Glasses_Status_Get
def Yesterday_Glasses_Status_Get(stunum):
    conn = DB_Connect()
    cur = conn.cursor()
    yesterday = datetime.now() - timedelta(days=1)
    yesterday_date = yesterday.date()
    
    try:
        query = "SELECT has_glasses FROM user_point WHERE stunum  = ? AND DATE(date) = ?"
        cur.execute(query,(stunum,yesterday_date))
        result = cur.fetchone()
        if result:
            return result[0] # has_glasses 값 반환
        else:
            return None # 전날 데이터가 없으면 None 반환
    except mariadb.Error as e:
        print(f"Error retrieving yesterday's glasses status: {e}")
        return None
    finally:
        cur.close()
        conn.close()
         
# DB를 통해 전날 출석 시간 조회 Yesterday_Attendance_Time_Get
def Yesterday_Attendance_Time_Get(stunum):
    conn = DB_Connect()
    cur = conn.cursor()
    yesterday = datetime.now() - timedelta(days=1)
    yesterday_date = yesterday.date().strftime("%Y-%m-%d")
    # print(yesterday_date)
    try:
        # 데이터베이스에서 전날의 출석 시간을 조회
        query = f"SELECT date FROM user_check WHERE stunum = {stunum} AND date >= '{yesterday_date} 00:00:00' and date <= '{yesterday_date} 23:59:59'"
        cur.execute(query)
        result = cur.fetchone()

        if result:
            return result[0]  # 전날의 출석 시간 반환
        return None  # 전날의 기록이 없으면 None 반환
    except mariadb.Error as e:
        print(f"Error retrieving previous attendance time: {e}")
        return None  # 오류 발생 시 None 반환
    finally:
        cur.close()
        conn.close()

def DB_FaceImg_Comfile(base64_string, output_path):
    try:
        # base64 디코딩
        image_data = base64.b64decode(base64_string.split(',')[1])
        
        # BytesIO를 사용하여 이미지 데이터를 메모리에 로드
        image_stream = BytesIO(image_data)
        
        # Pillow를 사용하여 이미지 객체 생성
        image = Image.open(image_stream)
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        # 이미지 파일로 저장
        image.save(output_path)
        print(f"이미지가 {output_path}에 저장되었습니다.")

    except Exception as e:
        print(f"이미지 오류 발생: {e}")

    except mariadb as e:
        print(f"DB 오류 발생: {e}")

def DB_FaceImg_Save():
    conn = DB_Connect()
    cur = conn.cursor()
    query = "SELECT name, stunum, faceimg FROM user"
    
    cur.execute(query)
    conn.commit()

    # 조회된 이미지 데이터를 파일로 저장
    for index, (name, stunum, image_data) in enumerate(cur):
        if image_data:
        
            file_path = Path_Image_Reconition_Data + f"/{name}.{stunum}.jpg"

            DB_FaceImg_Comfile(image_data.decode('utf-8'), file_path)

    # 연결 종료
    cur.close()
    conn.close()

def Save_Attendance_allData():
    
    conn = DB_Connect()
    cur = conn.cursor()
    
    datetime_str = "2024-01-08 08:30:01.000"
    # 문자열을 datetime으로 변환
    date_format = "%Y-%m-%d %H:%M:%S.%f"
    startdate = datetime.strptime(datetime_str, date_format)
    stunum = 202403838
    n = [5,6,12,13,19,20]
    try:
        for i in range(0,24):
            if i in n :
                continue
            else:
                date = startdate + timedelta(days=i)
                query = f"INSERT INTO user_check (stunum, date, state) VALUES ({stunum}, '{date}', 1)"
                cur.execute(query)
                conn.commit()
                print(f" IN : {date}")
                date = date + timedelta(hours=13) + timedelta(minutes=30)
                query = f"INSERT INTO user_check (stunum, date, state) VALUES ({stunum}, '{date}', 0)"
                cur.execute(query)
                conn.commit()
                print(f" OUT : {date}")
        
    except mariadb.Error as e:
        print(f"Error saving attendance data to database: {e}")
    finally:
        cur.close()
        conn.close()

def Save_Attendance_rangeData(n):
    
    conn = DB_Connect()
    cur = conn.cursor()
    stunum = 202403838
    try:
            for i in n :
                datetime_str = f"2024-02-{i} 08:30:10.000"
                # 문자열을 datetime으로 변환
                date_format = "%Y-%m-%d %H:%M:%S.%f"
                date = datetime.strptime(datetime_str, date_format)
                query = f"INSERT INTO user_check (stunum, date, state) VALUES ({stunum}, '{date}', 1)"
                cur.execute(query)
                conn.commit()
                print(f" IN : {date}")
                date = date + timedelta(hours=13) + timedelta(minutes=30)
                query = f"INSERT INTO user_check (stunum, date, state) VALUES ({stunum}, '{date}', 0)"
                cur.execute(query)
                conn.commit()
                print(f" OUT : {date}")
        
    except mariadb.Error as e:
        print(f"Error saving attendance data to database: {e}")
    finally:
        cur.close()
        conn.close()

def Save_Attendance_dddData():
    
    conn = DB_Connect()
    cur = conn.cursor()
    
    datetime_str = "2024-01-08 12:00:00.000"
    # 문자열을 datetime으로 변환
    date_format = "%Y-%m-%d %H:%M:%S.%f"
    startdate = datetime.strptime(datetime_str, date_format)
    stunum = 201910756
    n = [5,6,12,13,19,20]
    try:
        for i in range(0,24):
            if i in n :
                continue
            else:
                date = startdate + timedelta(days=i)
                query = f"INSERT INTO user_check (stunum, date, state) VALUES ({stunum}, '{date}', 0)"
                cur.execute(query)
                conn.commit()
                print(f" IN : {date}")
                date = date + timedelta(hours=1) + timedelta(minutes=30)
                query = f"INSERT INTO user_check (stunum, date, state) VALUES ({stunum}, '{date}', 1)"
                cur.execute(query)
                conn.commit()
                print(f" OUT : {date}")
        
    except mariadb.Error as e:
        print(f"Error saving attendance data to database: {e}")
    finally:
        cur.close()
        conn.close()
        
def Save_Attendance_rangeddData(n):
    
    conn = DB_Connect()
    cur = conn.cursor()
    stunum = 202403838
    try:
            for i in n :
                datetime_str = f"2024-02-{i} 12:00:00.000"
                # 문자열을 datetime으로 변환
                date_format = "%Y-%m-%d %H:%M:%S.%f"
                date = datetime.strptime(datetime_str, date_format)
                query = f"INSERT INTO user_check (stunum, date, state) VALUES ({stunum}, '{date}', 0)"
                cur.execute(query)
                conn.commit()
                print(f" IN : {date}")
                date = date + timedelta(hours=1) + timedelta(minutes=30)
                query = f"INSERT INTO user_check (stunum, date, state) VALUES ({stunum}, '{date}', 1)"
                cur.execute(query)
                conn.commit()
                print(f" OUT : {date}")
        
    except mariadb.Error as e:
        print(f"Error saving attendance data to database: {e}")
    finally:
        cur.close()
        conn.close()
        
Save_Attendance_allData()
n = [1,2,5,6]
Save_Attendance_rangeData(n)
