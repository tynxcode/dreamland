import { BusinessPremisesType, Direction, Furniture, HouseType, LandType, LegalDocuments, RealEstateCategory, RealEstateStatus, RealEstateType } from "../types/enums/realEstate"

export function moneyConverter(value: number): string {
    const formated = Intl.NumberFormat().format(value)
    const zeroGroup = (formated.match(/,/g) || []).length

    switch (zeroGroup) { 
        case 2:
            if(formated.split(',')[0].length < 2) {
                return formated.slice(0, 3) + " triệu"
            }

            if(formated.split(',')[0].length < 3) {
                return formated.slice(0, 4) + " triệu"
            }

            return formated.slice(0, formated.indexOf(",", 2)) + " triệu"
        case 3:
            return formated.slice(0, formated.indexOf(",", 3) - 1) + " tỷ"

        default:
            return formated
    }
}

export function categorySpeaker(type: RealEstateCategory): string {
    if (type === RealEstateCategory.MuaBan)
        return "Mua bán"
    else
        return "Cho thuê"
}

export function userTypeSpeaker(type: string): string {
    if (type === "CaNhan")
        return "Cá nhân"
    else
        return "Môi giới"
}

export function realEstateStatusSpeaker(type: RealEstateStatus): string {
    if (type === RealEstateStatus.DaBanGiao)
        return "Đã bàn giao"
    else
        return "Chưa bàn giao"
}

export function furnitureSpeaker(type: Furniture): string {
    switch (type) {
        case Furniture.CaoCap:
            return "Nội thất cao cấp"
        case Furniture.DayDu:
            return "Nội thất đầy đủ"
        case Furniture.HoanThien:
            return "Hoàn thiện cơ bản"

        default:
            return "Bàn giao thô"
    }
}

export function realEstateTypeSpeaker(type: RealEstateType | string | undefined): string {
    switch (type) {
        case RealEstateType.CanHo:
            return "Căn hộ/Chung cư"
        case RealEstateType.NhaO:
            return "Nhà ở"
        case RealEstateType.Dat:
            return "Đất"
        case RealEstateType.VanPhong:
            return "Văn phòng"
        case RealEstateType.PhongTro:
            return "Phòng trọ"

        default:
            return "Loại BĐS"
    }
}

export function legalDocumentsSpeaker(type: LegalDocuments): string {
    switch (type) {
        case LegalDocuments.DaCoSo:
            return "Đã có sổ"
        case LegalDocuments.DangChoSo:
            return "Đang chờ sổ"
        case LegalDocuments.GiayToKhac:
            return "Giấy tờ khác"
        default:
            return "Đang cập nhật"
    }
}

export function directionSpeaker(type: Direction): string {
    switch (type) {
        case Direction.Bac:
            return "Bắc"
        case Direction.DongBac:
            return "Đông bắc"
        case Direction.TayBac:
            return "Tây bắc"
        case Direction.Tay:
            return "Tây"
        case Direction.TayNam:
            return "Tây nam"
        case Direction.Dong:
            return "Đông"
        case Direction.DongNam:
            return "Đông nam"
        case Direction.Nam:
            return "Nam"

        default:
            return "Đang cập nhật"
    }
}

export function houseTypeSpeaker(type: HouseType): string {
    switch (type) {
        case HouseType.NhaBietThu:
            return "Nhà biệt thự"
        case HouseType.NhaMatTien:
            return "Nhà mặt tiền"
        case HouseType.NhaNgoHem:
            return "Nhà ngõ hẻm"
        case HouseType.NhaPhoLienKe:
            return "Nhà phố liền kề "
        default:
            return "Đang câp nhật"
    }
}

export function landTypeSpeaker(type: LandType): string {
    switch (type) {
        case LandType.DatCongNghiep:
            return "Đất công nghiệp"
        case LandType.DatNenDuAn:
            return "Đất nền dự án"
        case LandType.DatNongNghiep:
            return "Đất nông nghiệp"
        case LandType.DatThoCu:
            return "Đất thổ cư "
        default:
            return "Đang câp nhật"
    }
}

export function premisesTypeSpeaker(type: BusinessPremisesType): string {
    switch (type) {
        case BusinessPremisesType.MatBangKinhDoanh:
            return "Mặt bằng kinh doanh"
        case BusinessPremisesType.VanPhong:
            return "Văn phòng"
        case BusinessPremisesType.Officetel:
            return "Officetel"
        case BusinessPremisesType.ShopHouse:
            return "Shop House"
        default:
            return "Đang câp nhật"
    }
}

export function productStatusReader(type: any) {
    switch (type) {
        case "Available":
            return "Sẵn sàng"
        case "DatCoc":
            return "Đặt cọc"
        case "BanGiao":
            return "Bàn giao"
        case "Lock":
            return "Đã khoá GD"

        default:
            return ""
    }
}