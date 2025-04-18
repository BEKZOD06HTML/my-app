import React, { useState } from 'react';
import {
  Modal, Form, Input, DatePicker, Select,
  Button, Upload, message
} from 'antd';
import {
  ArrowLeftOutlined, CalendarOutlined, PictureOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const NasiyaModal = ({ open, onClose, debtorId, createDebt }) => {
  const [form] = Form.useForm();
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [debtPeriod, setDebtPeriod] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [monthlyDebt, setMonthlyDebt] = useState(0);
  const [description, setDescription] = useState('');

  const resetForm = () => {
    form.resetFields();
    setDescriptionVisible(false);
    setImages([]);
    setSelectedDate(null);
    setDebtPeriod(0);
    setTotalDebt(0);
    setMonthlyDebt(0);
    setDescription('');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (images.length < 2) {
        return message.error("Iltimos, ikkita rasm tanlang");
      }

      if (totalDebt <= 0) {
        return message.error("Qarz summasi 0 dan katta bo'lishi kerak");
      }

      if (debtPeriod <= 0) {
        return message.error("Qarz muddatini tanlang");
      }
      
      if (totalDebt > 1000000000) {
        return message.error("Qarz summasi juda katta (1 milliarddan katta). Iltimos, kichikroq summa kiriting.");
      }

      setLoading(true);

      // Qarz summasini 2 ta o'nlik raqam bilan cheklash
      const formattedTotalDebt = parseFloat(totalDebt.toFixed(2));
      const formattedDebtSum = parseFloat((formattedTotalDebt / debtPeriod).toFixed(2));

      // Nasiya ma'lumotlarini tayyorlash
      const debtData = {
        next_payment_date: selectedDate ? selectedDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        debt_period: Number(debtPeriod),
        total_debt_sum: formattedTotalDebt,
        debt_sum: formattedDebtSum,
        description: values.description || description || "",
        images: images.map(file => ({
          image: file.thumbUrl || file.url || file.name,
          uid: file.uid
        })),
        debt_status: 'active',
        debtor_id: debtorId
      };

      console.log("Modal: Yuborilayotgan ma'lumotlar:", debtData);

      await createDebt(debtData);
      message.success("Qarz muvaffaqiyatli yaratildi!");
      resetForm();
      onClose();
    } catch (err) {
      console.error("Form xatoligi:", err);
      if (err.errorFields) {
        message.error("Iltimos, barcha maydonlarni to'g'ri to'ldiring");
      } else if (err.message) {
        message.error(err.message);
      } else if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error("Qarz yaratishda xatolik yuz berdi. Internet aloqangizni tekshiring.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => { resetForm(); onClose(); }}
      footer={null}
      closable={false}
      width={420}
      centered
    >
      <div className="modal-header">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => { resetForm(); onClose(); }} />
        <h2>Nasiya yaratish</h2>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item label="Sana">
          <div style={{ display: 'flex', gap: 8 }}>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Sanani tanlang"
              suffixIcon={<CalendarOutlined />}
              format="YYYY-MM-DD"
              defaultValue={dayjs()}
            />
          </div>
        </Form.Item>

        <Form.Item label="Muddat (oy)" rules={[{ required: true, message: "Qarz muddatini tanlang" }]}>
          <Select
            placeholder="Qarz muddatini tanlang"
            onChange={(val) => {
              setDebtPeriod(val);
              if (totalDebt) {
                setMonthlyDebt(parseFloat((totalDebt / val).toFixed(2)));
              }
            }}
          >
            <Option key="1" value={1}>1 oy</Option>
            <Option key="2" value={2}>2 oy</Option>
            <Option key="3" value={3}>3 oy</Option>
            <Option key="6" value={6}>6 oy</Option>
            <Option key="12" value={12}>12 oy</Option>
          </Select>
        </Form.Item>

        <Form.Item 
          label="Umumiy qarz summasi" 
          rules={[
            { required: true, message: "Qarz summasini kiriting" },
            { type: 'number', min: 1, message: "Qarz summasi 0 dan katta bo'lishi kerak" }
          ]}
        >
          <Input
            type="number"
            placeholder="Masalan: 353252 sum"
            value={totalDebt}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              setTotalDebt(value);
              if (debtPeriod) {
                setMonthlyDebt(parseFloat((value / debtPeriod).toFixed(2)));
              }
            }}
            max={1000000000}
          />
        </Form.Item>

        <Form.Item label="Oylik to'lov">
          <Input
            type="number"
            placeholder="Oylik to'lov summasi"
            value={monthlyDebt}
            disabled
          />
        </Form.Item>

        {!descriptionVisible ? (
          <Form.Item>
            <Button type="dashed" onClick={() => setDescriptionVisible(true)} block>
              Izoh qo'shish
            </Button>
          </Form.Item>
        ) : (
          <Form.Item label="Izoh" name="description">
            <Input.TextArea
              placeholder="Izohni shu yerga yozing..."
              autoSize={{ minRows: 3 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        )}

        <Form.Item 
          label="Rasmlar (2 ta)" 
          rules={[{ required: true, message: "Iltimos, ikkita rasm tanlang" }]}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            onChange={({ fileList }) => setImages(fileList.slice(-2))}
            fileList={images}
            maxCount={2}
          >
            {images.length < 2 && (
              <div>
                <PictureOutlined />
                <div>Rasm qo'shish</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            block
          >
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NasiyaModal; 