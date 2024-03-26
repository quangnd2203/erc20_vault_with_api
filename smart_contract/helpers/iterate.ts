// Hàm mapValues dùng để ánh xạ các giá trị trong một đối tượng hoặc mảng
export const mapValues = (obj: { [s: string]: unknown; } | ArrayLike<unknown> = {}, fn: (arg0: unknown) => any = () => { }) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));

// Hàm product dùng để tính tích Descartes của một danh sách các mảng
export const product = (...arrays: any[]) => arrays.reduce((a, b) => a.flatMap((ai: any) => b.map((bi: any) => [...ai, bi])), [[]]);

// Hàm unique dùng để lấy các phần tử duy nhất trong một mảng
export const unique = (...array: any[]) => array.filter((obj, i) => array.indexOf(obj) === i);

// Hàm zip dùng để ghép nối các mảng với nhau
export const zip = (...args: any[]) =>
    Array(Math.max(...args.map(array => array.length))) // Tạo một mảng mới với độ dài bằng độ dài lớn nhất trong các mảng đầu vào
        .fill(undefined) // Điền các giá trị trong mảng mới với undefined
        .map((_, i) => args.map(array => array[i])); // Ánh xạ mỗi phần tử trong mảng mới thành một mảng con chứa các phần tử tại vị trí tương ứng từ các mảng đầu vào