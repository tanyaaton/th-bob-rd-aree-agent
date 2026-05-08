# API Curl Examples

Base URL: `http://localhost:8080`

## 1. Validate User

Endpoint: `POST /api/validate-user`

```bash
curl -X POST http://localhost:8080/api/validate-user \
  -H "Content-Type: application/json" \
  -d '{
    "national_id": "1234567890123"
  }'
```

### Example invalid user
```bash
curl -X POST http://localhost:8080/api/validate-user \
  -H "Content-Type: application/json" \
  -d '{
    "national_id": "9999999999999"
  }'
```

---

## 2. Submit Tax Form

Endpoint: `POST /api/submit-tax`

```bash
curl -X POST http://localhost:8080/api/submit-tax \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "national_id": "1234567890123",
    "income_data": [
      {
        "type": 1,
        "amount": 50000
      },
      {
        "type": 3,
        "amount": 10000
      }
    ]
  }'
```

### Example with one income type
```bash
curl -X POST http://localhost:8080/api/submit-tax \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "national_id": "1234567890123",
    "income_data": [
      {
        "type": 1,
        "amount": 50000
      }
    ]
  }'
```

### Example with all income types from [`income_type.md`](income_type.md)

Income type IDs:
- `1` = เงินเดือนหรือเงินได้ตามสัญญาจ้างแรงงาน (มาตรา 40(1))
- `2` = เงินได้ที่นายจ้างจ่ายให้ครั้งเดียวเพราะเหตุออกจากงาน (กรณีไม่นำไปรวมคำนวณภาษี) (มาตรา 40(1))
- `3` = เงินได้จากการรับจ้าง ฟรีแลนซ์ ค่าตำแหน่ง เบี้ยประชุม หรือค่านายหน้า (มาตรา 40(2))
- `4` = ค่าลิขสิทธิ์ ค่าสิทธิ์ในทรัพย์สินทางปัญญา (Royalty) และค่ากู๊ดวิลล์ (Goodwill) หรือเงินได้รายปีที่ได้มาจากนิติกรรม และคำพิพากษาของศาล (มาตรา 40(3))
- `5` = ค่าเช่า ค่าผิดสัญญาเช่าซื้อหรือซื้อขายเงินผ่อน (มาตรา 40(5))
- `6` = ค่าตอบแทนจากการประกอบวิชาชีพอิสระ วิชากฎหมาย การประกอบโรคศิลปะ วิศวกรรม สถาปัตยกรรม การบัญชี ประณีตศิลปกรรม (มาตรา 40(6))
- `7` = เงินได้จากการรับเหมาที่ผู้รับเหมาทั้งค่าแรงและค่าของ ที่ต้องลงทุนด้วยการจัดหาสัมภาระ ในส่วนสำคัญ นอกจากเครื่องมือ (มาตรา 40(7))
- `8` = เงินได้จากธุรกิจ การพาณิชย์ การเกษตร การอุตสาหกรรม การขนส่ง และเงินได้อื่นๆ (มาตรา 40(8))
- `9` = เงินได้จากการขายอสังหาริมทรัพย์ฯ (มาตรา 40(8))
- `10` = ดอกเบี้ย เงินเทียบเท่าเงินปันผล เงินปันผลจากบริษัทต่างประเทศ ประโยชน์ใดๆ จากคริปโทเคอร์เรนซีหรือโทเคนดิจิทัล เงินเพิ่มทุน เงินลดทุน (มาตรา 40(4))
- `11` = เงินปันผล ส่วนแบ่งกำไรจากหุ้น/กองทุน (มาตรา 40(4)(ข))
- `12` = กำไรจากการขายกองทุนรวมเพื่อการเลี้ยงชีพ (RMF)
- `13` = กำไรจากการขายกองทุนรวมหุ้นระยะยาว (LTF)
- `14` = กำไรจากการขายกองทุนเพื่อการออม (SSF)
- `15` = กำไรจากการขายหน่วยลงทุนในกองทุนรวมไทยเพื่อความยั่งยืน (Thai ESG)/แบบพิเศษ (Thai ESGX)
- `16` = เงินได้พึงประเมินที่ได้ใช้สิทธิเลือกเสียภาษีโดยไม่ต้องนำมารวมคำนวณภาษีกับเงินได้อื่น
- `17` = เงินได้จากการให้หรือการรับ (มาตรา 40(8))

```bash
curl -X POST http://localhost:8080/api/submit-tax \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "national_id": "1234567890123",
    "income_data": [
      {
        "type": 1,
        "amount": 50000
      },
      {
        "type": 2,
        "amount": 10000
      },
      {
        "type": 3,
        "amount": 15000
      },
      {
        "type": 4,
        "amount": 8000
      },
      {
        "type": 5,
        "amount": 18000
      },
      {
        "type": 6,
        "amount": 22000
      },
      {
        "type": 7,
        "amount": 27000
      },
      {
        "type": 8,
        "amount": 32000
      },
      {
        "type": 9,
        "amount": 45000
      },
      {
        "type": 10,
        "amount": 12000
      },
      {
        "type": 11,
        "amount": 7000
      },
      {
        "type": 12,
        "amount": 3000
      },
      {
        "type": 13,
        "amount": 4000
      },
      {
        "type": 14,
        "amount": 2500
      },
      {
        "type": 15,
        "amount": 3500
      },
      {
        "type": 16,
        "amount": 2000
      },
      {
        "type": 17,
        "amount": 9000
      }
    ]
  }'
```

---

## 3. Get Submission History

Endpoint: `GET /api/history`

```bash
curl http://localhost:8080/api/history
```

---

## Notes

- The allowed National ID is `1234567890123` as checked in [`validate_user()`](tax-submission-app/app.py:26) and [`submit_tax()`](tax-submission-app/app.py:61).
- Start the server first from [`tax-submission-app/app.py`](tax-submission-app/app.py):
  ```bash
  python app.py
  ```
- The server runs at `http://localhost:8080`