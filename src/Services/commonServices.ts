

// Use axios to send the form data
export const CommonService = {
    buildFormData: (data: any, formData = new FormData(), parentKey = ''): FormData => {
        if (data === null || data === undefined) return formData;

        // Handle File directly
        if (data instanceof File) {
            formData.append(parentKey, data);
            return formData;
        }

        // Handle array
        if (Array.isArray(data)) {
            data.forEach((value, index) => {
                const key = `${parentKey}[${index}]`;
                CommonService.buildFormData(value, formData, key);
            });
            return formData;
        }

        // Handle object
        if (typeof data === 'object' && !(data instanceof Date)) {
            Object.keys(data).forEach((key) => {
                const value = data[key];
                const formKey = parentKey ? `${parentKey}.${key}` : key;

                CommonService.buildFormData(value, formData, formKey);
            });
            return formData;
        }

        // Handle primitive
        formData.append(parentKey, data.toString());
        return formData;
    },
    ToLocalString(dateString: string): string {
        const date = new Date(dateString); // Parses string to local time
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date string: ${dateString}`);
        }

        return date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0') + 'T' +
            String(date.getHours()).padStart(2, '0') + ':' +
            String(date.getMinutes()).padStart(2, '0') + ':' +
            String(date.getSeconds()).padStart(2, '0');
    },
    FormatExactDate: (dateTimeString: string) => {
        // Split into date and time parts
        const [datePart, timePart] = dateTimeString.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hour, minute, second] = (timePart || "00:00:00").split(":").map(Number);

        // Weekday calculation (using Date just to get day-of-week)
        const jsDate = new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00`);
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weekday = weekdays[jsDate.getDay()];

        // Convert to 12-hour format with AM/PM
        let hh = hour;
        let suffix = "AM";
        if (hh >= 12) {
            suffix = "PM";
            if (hh > 12) hh -= 12;
        }
        if (hh === 0) hh = 12;

        // Add leading zeros
        const dd = String(day).padStart(2, "0");
        const mm = String(month).padStart(2, "0");
        const yyyy = year;
        const h = String(hh).padStart(2, "0");
        const m = String(minute).padStart(2, "0");
        const s = String(second).padStart(2, "0");

        return `${weekday}, ${dd}/${mm}/${yyyy}, ${h}:${m}:${s} ${suffix}`;
    },
    FormatDate: (utcDateTimeString: string) => {
        // Create a Date object from the UTC string
        const utcDate = new Date(utcDateTimeString + "Z");

        // Format the date using Intl.DateTimeFormat
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };

        // Create a formatter for the local time
        const formatter = new Intl.DateTimeFormat('en-GB', options);

        // Format the date and return it
        const formattedDate = formatter.format(utcDate);

        // Return the formatted date in the desired format: dd/MM/yyyy hh:mm:ss AM/PM
        return formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2}) ([APM]{2})/, '$2/$1/$3 $4:$5:$6 $7');
    },
    Delay: (ms: number) => new Promise(res => setTimeout(res, ms)),
    IsScrollingDownAndNearBottom: (lastScrollTop: number) => {
        const currentScroll =
            window.pageYOffset || document.documentElement.scrollTop;

        const isDown = currentScroll > lastScrollTop;

        const isAtBottom =
            window.innerHeight + currentScroll >=
            document.documentElement.scrollHeight - 1;

        const newScrollTop = currentScroll <= 0 ? 0 : currentScroll;

        return {
            shouldLoad: isDown && isAtBottom,
            lastScrollTop: newScrollTop
        };
    },
    IsEmptyValueInForm: (obj: any, optionalFields: string[]): boolean => {

        for (const key in obj) {

            if (key !== "id" &&
                !optionalFields.find(r => r === key) &&
                (obj[key] === "" ||
                    obj[key] === null
                )
            ) {
                return true;
            }

        }

        return false;
    },
    SaveDataToSession: (obj: any) => {
        for (const key in obj) {
            localStorage.setItem(key, obj[key] ?? "");
        }
    },
    ClearSession: () => {
        localStorage.clear();
    },
    GetSessionValByKey: (key: string) => {
        return localStorage.getItem(key);
    },
    GetUserToken() {
        return CommonService.GetSessionValByKey("accessToken");
    },
    GetRefreshToken() {
        return CommonService.GetSessionValByKey("refreshToken");
    },
    IsAuthenticated() {
        return CommonService.GetSessionValByKey("accessToken") ? true : false;
    }
}