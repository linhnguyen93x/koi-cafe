import React, { Component } from "react";
import ReactNative from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Colors, globalStyle } from "../style";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as language from "../language";
import { EmployeeItem, NoData, FieldSet } from "../components";
import moment from 'moment'

const {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView
} = ReactNative;

class DetailSalary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isLoading: false
    };
  }

  componentWillMount() {
    this.props.getPaySlip(moment(new Date()).subtract(1, 'months').format("YYYY-MM"));
  }

  render() {
    if (this.props.detailSalaryInfo.get("data") == null) {
      return <ActivityIndicator />;
    }

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
            ? this.props.detailSalaryInfo.get("data").LuongCoban
            : ""
        },
        {
          title: "Lương 1\nngày công",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("Luong1Ngay")
            ? this.props.detailSalaryInfo.get("data").Luong1Ngay
            : ""
        },
        {
          title: "Lương 1\ngiờ công",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("Luong1Gio")
            ? this.props.detailSalaryInfo.get("data").Luong1Gio
            : ""
        },
        {
          title: "Lương cơ bản\nthực nhận",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("LuongCoBanThucNhan")
            ? this.props.detailSalaryInfo.get("data").LuongCoBanThucNhan
            : ""
        },
        {
          title: "Lương\ntăng ca",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("LuongTangCa")
            ? this.props.detailSalaryInfo.get("data").LuongTangCa
            : ""
        },
        {
          title: "Lương\nngày lễ",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("LuongNgayLe")
            ? this.props.detailSalaryInfo.get("data").LuongNgayLe
            : ""
        }
      ];
      data2 = [
        {
          title: "Chuyên cần",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("ChuyenCan")
            ? this.props.detailSalaryInfo.get("data").ChuyenCan
            : ""
        },
        { title: "Chức vụ", value: "0" },
        {
          title: "Trợ cấp khác",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("PhuCapKhac")
            ? this.props.detailSalaryInfo.get("data").PhuCapKhac
            : ""
        },
        {
          title: "Ngôn ngữ",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("TienNgonNgu")
            ? this.props.detailSalaryInfo.get("data").TienNgonNgu
            : ""
        },
        {
          title: "Quản lý tiệm",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("QuanLyTiem")
            ? this.props.detailSalaryInfo.get("data").QuanLyTiem
            : ""
        },
        {
          title: "Tiền cơm",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("TienCom")
            ? this.props.detailSalaryInfo.get("data").TienCom
            : ""
        },
        {
          title: "Trợ cấp cố định",
          value: this.props.detailSalaryInfo
            .get("data")
            .hasOwnProperty("TroCapCoDinh")
            ? this.props.detailSalaryInfo.get("data").TroCapCoDinh
            : ""
        }
      ];
      data3 = [
				{
					title: "Ngày nghỉ",
					value: this.props.detailSalaryInfo
						.get("data")
						.hasOwnProperty("NgayNghi")
						? this.props.detailSalaryInfo.get("data").NgayNghi
						: ""
				},
				{
					title: "Phút đi trễ",
					value: this.props.detailSalaryInfo
						.get("data")
						.hasOwnProperty("PhutDiTre")
						? this.props.detailSalaryInfo.get("data").PhutDiTre
						: ""
				},
				{
					title: "Quên bấm thẻ",
					value: this.props.detailSalaryInfo
						.get("data")
						.hasOwnProperty("SoLanQuenBamThe")
						? this.props.detailSalaryInfo.get("data").SoLanQuenBamThe
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
          value: this.props.detailSalaryInfo.get("data").LuongCoBanThucNhan
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
              "https://s-media-cache-ak0.pinimg.com/236x/2e/56/a1/2e56a1d72c817e63bb74f6cb1b7636eb.jpg"
          }}
          style={styles.logo}
        />
        <ScrollView>
          <FieldSet label="Chi tiết bảng lương" data={data1} />
          <FieldSet label="Các khoản trợ cấp" data={data2} />
          <FieldSet label="Các khoản bị trừ tiền" data={data3} />
          {/* <FieldSet label="Phúc lợi" data={data4} /> */}
          <FieldSet label="Tổng số lương thực nhận" data={data5} size="large" />
        </ScrollView>

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
  }
});

function mapStateToProps(state) {
  return {
    detailSalaryInfo: state.detailSalaryInfo
  };
}

export default connect(mapStateToProps)(DetailSalary);
