// src/data/tournamentRules.js

// Dữ liệu thuần, có thể lưu mỗi mục thành một document trong
// collection "tournament_rules" và sắp xếp theo trường "order".
// Những thông tin chưa được xác nhận được thể hiện rõ trong nội dung.
export const tournamentRules = [
  {
    id: "general",
    order: 1,
    label: "Quy chế chung",
    title: "Chơi hết mình. Tôn trọng hết mực.",
    description:
      "Nguyên tắc tham gia và ứng xử dành cho cộng đồng Ốc Thượng Đài.",
    notice:
      "Thông báo của từng mùa giải sẽ xác định lịch thi đấu, điều kiện tham gia và các nội dung áp dụng cụ thể.",
    facts: [
      { label: "Tinh thần", value: "Công bằng và tôn trọng" },
      { label: "Xác nhận", value: "Qua ban tổ chức" },
      { label: "Lịch đấu", value: "Công bố theo từng mùa" },
    ],
    sections: [
      {
        id: "participation",
        title: "Đăng ký và xác nhận tham gia",
        items: [
          "Cung cấp Ingame + tagline, ID Discord và máy chủ mong muốn chính xác để ban tổ chức kiểm tra hồ sơ.",
          "Level Discord tối thiểu là điều kiện xét cấp role Ốc Tráng Sĩ, được công bố theo quy chế của từng đợt.",
          "Người đăng ký cần có role Ốc Tráng Sĩ theo quy chế áp dụng trước khi được BTC xác nhận suất thi đấu.",
          "Khai báo đã có role trong biểu mẫu không thay thế việc MOD kiểm tra trên Discord.",
          "Gửi biểu mẫu là bước ghi nhận nguyện vọng tham gia; suất thi đấu chỉ được xác nhận khi ban tổ chức liên hệ.",
          "Theo dõi thông báo chính thức về điều kiện tham gia, thời hạn đăng ký và lịch thi đấu.",
          "Nếu không thể tham dự, thông báo sớm để ban tổ chức sắp xếp danh sách.",
        ],
      },
      {
        id: "conduct",
        title: "Ứng xử trong cộng đồng",
        items: [
          "Tôn trọng đối thủ, đồng đội, khán giả và ban tổ chức.",
          "Không xúc phạm, quấy rối, phân biệt đối xử hoặc cố tình gây gián đoạn trận đấu.",
          "Không spam, phát tán liên kết lừa đảo hoặc nội dung không phù hợp.",
          "Giữ tinh thần thi đấu tích cực, kể cả khi kết quả không như mong muốn.",
        ],
      },
      {
        id: "fair-play",
        title: "Thi đấu công bằng",
        items: [
          "Không sử dụng phần mềm gian lận, công cụ can thiệp trái phép hoặc khai thác lỗi để tạo lợi thế.",
          "Không dàn xếp kết quả, thi đấu hộ hoặc cố ý cung cấp thông tin sai.",
          "Không theo dõi livestream để lấy thông tin có thể tạo lợi thế trong trận đang diễn ra.",
          "Báo cáo vấn đề bằng thông tin và bằng chứng cụ thể, tránh tranh cãi làm gián đoạn trận đấu.",
        ],
      },
      {
        id: "incidents",
        title: "Sự cố và khiếu nại",
        items: [
          "Khi gặp lỗi kết nối hoặc sự cố kỹ thuật, báo ngay cho ban tổ chức.",
          "Việc tạm dừng, thi đấu lại hoặc xử lý kết quả được xem xét theo tình huống và quy chế của mùa giải.",
          "Gửi khiếu nại kèm thời điểm, mô tả và bằng chứng để ban tổ chức đối chiếu.",
          "Các hình thức xử lý vi phạm được công bố theo mức độ và điều lệ áp dụng.",
        ],
      },
    ],
  },
  {
    id: "five-v-five",
    order: 2,
    label: "Thập Diện Mai Phục",
    title: "Thập Diện Mai Phục",
    description:
      "Giải custom VALORANT 5v5 dành cho những màn phối hợp và giao tranh đồng đội.",
    notice:
      "Thể thức chi tiết của mùa 5v5 chưa được xác nhận tại đây. Các mục đang chờ công bố không phải điều lệ thi đấu chính thức.",
    facts: [
      { label: "Trò chơi", value: "VALORANT" },
      { label: "Hình thức", value: "Custom 5v5" },
      { label: "Giải thưởng", value: "Công bố theo từng mùa" },
    ],
    sections: [
      {
        id: "five-roster",
        title: "Đội hình và đăng ký",
        items: [
          "Mỗi bên thi đấu với năm người trong phòng custom.",
          "Mỗi người gửi một hồ sơ đăng ký riêng; BTC kiểm tra điều kiện và sắp xếp đội hình.",
          "Giải có 10 suất chính thức cùng danh sách dự bị, xét theo thứ tự gửi hồ sơ và điều kiện trong quy chế của đợt.",
          "Việc ghép đội, xác nhận đội hình và cho phép thành viên dự bị sẽ được công bố theo mùa.",
          "Đại diện đội có trách nhiệm theo dõi và chuyển thông báo đến các thành viên.",
        ],
      },
      {
        id: "five-format",
        title: "Thể thức và bản đồ",
        items: [
          "Số vòng, cách chia bảng và số ván mỗi cặp đấu sẽ được ban tổ chức công bố trước khi giải bắt đầu.",
          "Danh sách bản đồ và quy trình chọn hoặc cấm bản đồ được áp dụng theo thông báo của mùa giải.",
          "Máy chủ, cài đặt phòng và thứ tự chọn bên sẽ được xác nhận trước trận.",
          "Các giới hạn đặc biệt về trang bị hoặc kỹ năng chỉ áp dụng khi đã được công bố rõ.",
        ],
      },
      {
        id: "five-results",
        title: "Kết quả và phần thưởng",
        items: [
          "Kết quả được đối chiếu với trận đấu và xác nhận bởi ban tổ chức.",
          "Hạng mục giải thưởng, giá trị và điều kiện nhận thưởng sẽ được công bố theo từng mùa.",
          "Các danh hiệu cá nhân, nếu có, sẽ đi kèm tiêu chí đánh giá được thông báo trước.",
        ],
      },
    ],
  },
  {
    id: "one-v-one",
    order: 3,
    label: "Độc Cô Cầu Bại",
    title: "Độc Cô Cầu Bại",
    description:
      "Giải custom dao 1v1. Một đối thủ, một cuộc đấu và tinh thần chơi đẹp.",
    notice:
      "Khung thể thức bên dưới cần được đối chiếu với thông báo của mùa đang mở. Lịch, số suất và phần thưởng được xác nhận riêng.",
    facts: [
      { label: "Trò chơi", value: "VALORANT" },
      { label: "Hình thức", value: "Dao 1v1" },
      { label: "Khung thể thức", value: "BO5 · Loại trực tiếp" },
    ],
    sections: [
      {
        id: "one-combat",
        title: "Luật giao đấu",
        items: [
          "Thi đấu custom dao 1v1 trên Skirmish theo phòng do ban tổ chức sắp xếp.",
          "Chỉ sử dụng dao; không sử dụng súng hoặc kỹ năng.",
          "Được lựa chọn đặc vụ nhưng vẫn phải tuân thủ quy định không dùng kỹ năng.",
          "Mỗi lần hạ gục hợp lệ được tính là một round thắng.",
        ],
      },
      {
        id: "one-format",
        title: "BO5 và nhánh đấu",
        items: [
          "Khung BO5: người đạt ba round thắng trước sẽ thắng cặp đấu.",
          "Thi đấu loại trực tiếp; người thắng tiến vào vòng tiếp theo.",
          "Nếu mùa giải có 16 người, thứ tự vòng là vòng 16 người, tứ kết, bán kết và chung kết.",
          "Danh sách, cách xếp nhánh và cách xử lý suất trống được công bố trước khi thi đấu.",
        ],
      },
      {
        id: "one-operations",
        title: "Điều phối và phần thưởng",
        items: [
          "Có mặt đúng giờ và chờ hướng dẫn vào phòng từ ban tổ chức.",
          "Không tự ý bắt đầu lại hoặc thay đổi cài đặt phòng khi chưa được xác nhận.",
          "Kết quả cần được xác nhận trước khi tiến hành cặp đấu tiếp theo.",
          "Phần thưởng và điều kiện trao danh hiệu được công bố theo mùa giải.",
        ],
      },
    ],
  },
];
