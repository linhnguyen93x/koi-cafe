import React, { Component } from "react";
import ReactNative from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Colors, globalStyle } from "../style";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as language from "../language";
import { EmployeeItem, NoData, FieldSet } from "../components";
import moment from 'moment'
import Picker from 'react-native-picker'

const {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView
} = ReactNative;

const currentYear = new Date().getFullYear();
const pickerData = [
  ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
  [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4, currentYear - 5, currentYear - 6, currentYear - 7]
];

class DetailSalary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isLoading: false,
      month: moment(new Date()).subtract(1, 'months').format("YYYY-MM")
    };
  }

  numberWithDot = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  componentWillMount() {
    this._getPaySlip(this.state.month);
  }

  _getPaySlip = month => {
    this.setState({
      isLoading: true
    })
    this.props.getPaySlip(month).then(() => {
      this.setState({
        isLoading: false
      })
    });
  }

  _openDropDown() {
    Picker.init({
      pickerData: pickerData,
      pickerConfirmBtnText: language.get('choose'),
      pickerCancelBtnText: language.get('cancel'),
      pickerTitleText: language.get('choose_a_month'),
      selectedValue: [this.state.month.split('-')[1], this.state.month.split('-')[0]],
      onPickerConfirm: data => {
        this.setState({
          month: data[1] + "-" + data[0]
        }, () => {
          this._getPaySlip(this.state.month);
        });
      },
      onPickerCancel: data => {

      },
      onPickerSelect: data => {

      }
    });
    Picker.show();
  }

  render() {

    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    let data5 = [];
    if (this.props.detailSalaryInfo.get("data") != null) {
      data1 = [
        {
          title: "Lương\ncơ bản",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("LuongCoban")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").LuongCoban))
            : ""
        },
        {
          title: "Lương 1\nngày công",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("Luong1Ngay")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").Luong1Ngay))
            : ""
        },
        {
          title: "Lương 1\ngiờ công",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("Luong1Gio")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").Luong1Gio))
            : ""
        },
        {
          title: "Lương cơ bản\nthực nhận",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("LuongCoBanThucNhan")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").LuongCoBanThucNhan))
            : ""
        },
        {
          title: "Lương\ntăng ca",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("LuongTangCa")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").LuongTangCa))
            : ""
        },
        {
          title: "Lương\nngày lễ",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("LuongNgayLe")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").LuongNgayLe))
            : ""
        }
      ];
      data2 = [
        {
          title: "Chuyên cần",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("ChuyenCan")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").ChuyenCan))
            : ""
        },
        { title: "Chức vụ", value: "0" },
        {
          title: "Trợ cấp khác",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("PhuCapKhac")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").PhuCapKhac))
            : ""
        },
        {
          title: "Ngôn ngữ",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("TienNgonNgu")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").TienNgonNgu))
            : ""
        },
        {
          title: "Quản lý tiệm",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("QuanLyTiem")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").QuanLyTiem))
            : ""
        },
        {
          title: "Tiền cơm",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("TienCom")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").TienCom))
            : ""
        },
        {
          title: "Trợ cấp cố định",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("TroCapCoDinh")
            ? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").TroCapCoDinh))
            : ""
        }
      ];
      data3 = [
				{
					title: "Ngày nghỉ",
					value: this.props.detailSalaryInfo
						.get("data")
						.hasOwnProperty("NgayNghi")
						? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").NgayNghi))
						: ""
				},
				{
					title: "Phút đi trễ",
					value: this.props.detailSalaryInfo
						.get("data")
						.hasOwnProperty("PhutDiTre")
						? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").PhutDiTre))
						: ""
				},
				{
					title: "Quên bấm thẻ",
					value: this.props.detailSalaryInfo
						.get("data")
						.hasOwnProperty("SoLanQuenBamThe")
						? this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").SoLanQuenBamThe))
						: ""
				}
      ];
      // data4 = [
      //   { title: "Tiền doanh thu", value: "100.000" },
      //   { title: "Tiền phúc lợi", value: "200.000" },
      //   { title: "Tiền thưởng tết", value: "150.000" }
      // ];
      data5 = [
        {
          title: null,
          value: this.numberWithDot(parseInt(this.props.detailSalaryInfo.get("data").LuongCoBanThucNhan))
        }
      ];

    }

    return (
      <Image
        style={[
          styles.imgContainer,
          globalStyle.container,
          globalStyle.mainPaddingTop
        ]}
        source={require("../../assets/backgrounds/main_bg.png")}
        resizeMode={Image.resizeMode.cover}
      >
        <Image
          source={{
            uri:
            "http://www.limestone.edu/sites/default/files/user.png"
          }}
          style={styles.logo}
          resizeMode="cover"
        />
        <View style={styles.picker_container}>
          <TouchableWithoutFeedback
            onPress={() => this._openDropDown()}>
            <View style={styles.picker}>
              <Text>{this.state.month.split('-').reverse().join('-')}</Text>
              <Icon name="calendar" size={15} color="#036380" />
            </View>
          </TouchableWithoutFeedback>
        </View>
        {this.state.isLoading ? <ActivityIndicator /> :
          this.props.detailSalaryInfo.get("data") != null ? <ScrollView>
            <FieldSet label="Chi tiết bảng lương" data={data1} />
            <FieldSet label="Các khoản trợ cấp" data={data2} />
            <FieldSet label="Các khoản bị trừ tiền" data={data3} />
            {/* <FieldSet label="Phúc lợi" data={data4} /> */}
            <FieldSet label="Tổng số lương thực nhận" data={data5} size="large" />
          </ScrollView> : <NoData />}


      </Image>
    );




  }
}

// Css for each view
const styles = StyleSheet.create({
  imgContainer: {
    width: undefined,
    height: undefined,
    backgroundColor: "transparent",
    alignItems: "center"
  },
  logo: {
    height: 100,
    width: 100,
    borderRadius: 50,
    resizeMode: "contain",
    marginBottom: 8
  },
  picker_container: {
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 48
  },
  picker: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

function mapStateToProps(state) {
  return {
    detailSalaryInfo: state.detailSalaryInfo
  };
}

export default connect(mapStateToProps)(DetailSalary);
